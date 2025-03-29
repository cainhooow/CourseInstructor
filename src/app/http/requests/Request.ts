import ValidationHelper from "@/app/helpers/ValidationHelper";
import { Validator } from "@courseinstructor/validator";
import { ValidationError } from "../errors/ValidationError";
import { Request as ExpressRequest } from "express";
import Logger from "@/app/utils/Logger";

export interface IRequest<T> {
  validateAsync(): Promise<boolean>;
  hasErrors(): string[];
  getData<ExtraFields extends Record<string, any> = {}>(): T & ExtraFields;
}

export default abstract class Request<T extends Record<string, string> = {}>
  implements IRequest<T>
{
  protected errors: string[] = [];
  protected data: Record<string, any>;

  private removedFields: string[] = [];
  private optionalFields: string[] = [];
  private renamedFields: Record<string, string> = {};

  constructor(
    protected readonly req: ExpressRequest,
    private requiredFields: string[],
    protected helper = new ValidationHelper()
  ) {
    this.data = req.body || {};
  }

  public async validateAsync(): Promise<boolean> {
    this.errors = [];

    if (typeof this.data === "undefined") {
      this.errors.push(this.req.t("validation.failed"));
      throw new ValidationError(this.errors);
    }

    for (const field of this.requiredFields) {
      if (
        !(field in this.data) &&
        !this.fieldIsRemoved(field) &&
        !this.fieldIsOptional(field)
      ) {
        this.errors.push(
          this.req.t("validation.missing", {
            field: field,
          })
        );
        throw new ValidationError(this.errors);
      }
    }

    await this.applyRulesAsync();

    if (this.errors.length > 0) {
      throw new ValidationError(this.errors);
    }

    return true;
  }

  protected validation(): boolean {
    return true;
  }

  private async applyRulesAsync() {
    const rules = this.rules();

    for (const [field, ruleString] of Object.entries(rules)) {
      const value = this.data[field];
      if (!value || typeof value === "undefined") return;

      const ruleList = ruleString.split("|");

      for (const rule of ruleList) {
        if (this.fieldIsRemoved(field)) {
          return delete this.data[field];
        }

        if (this.fieldIsOptional(field)) return;

        const validator = new Validator(rule, field, value, this.req.t);
        const validationResult = validator.validate();
        const fnTransform = /(?<=transform)\./;

        if (validationResult && fnTransform.test(validationResult)) {
          const transformedValue = validationResult.split(fnTransform)[1];
          this.data[field] = transformedValue;
        }

        if (validationResult && !fnTransform.test(validationResult)) {
          this.errors.push(validationResult);
        }

        const uniqueMatch = rule.match(/^unique:([\w_]+)$/);
        if (uniqueMatch) {
          const tableName = uniqueMatch[1];
          const isUnique = await this.helper.unique(tableName, field, value);

          if (!isUnique) {
            this.errors.push(`${tableName} already exists`);
          }
        }
      }
    }
  }

  protected rules(): Record<string, string> {
    return {};
  }

  public hasErrors(): string[] {
    return this.errors;
  }

  private fieldIsOptional(key: string) {
    return this.optionalFields.includes(key);
  }

  private fieldIsRemoved(key: string): boolean {
    return this.removedFields.includes(key);
  }

  public optionals(fields: string[]) {
    Logger.log("DEBUG", `Field ${fields} marked with optional in request`);
    fields.map((field) => {
      if (this.optionalFields.includes(field)) {
        throw new Error(
          `Field ${field} field already mark to optional in request`
        );
      }

      this.optionalFields.push(field);
    });
  }

  public optional(field: string) {
    Logger.log("DEBUG", `Field ${field} marked with optional in request.body`);

    if (this.fieldIsOptional(field)) {
      throw new Error(
        `Field ${field} field already mark to optional in request.body`
      );
    }

    this.optionalFields.push(field);
    return this;
  }

  public removeFields(fields: string[]) {
    Logger.log("DEBUG", `Field ${fields} deleted from request.body`);

    fields.map((field) => {
      if (this.removedFields.includes(field)) {
        throw new Error(`Field ${field} already exists in ignore list`);
      }

      this.removedFields.push(field);
    });

    return this;
  }

  public removeField<K extends keyof T | {}>(field: K) {
    Logger.log("DEBUG", `Field ${field.toString()} deleted from request.body`);

    if (this.fieldIsRemoved(field as string)) {
      throw new Error(`Field ${field.toString()} already in ignore list`);
    }

    this.removedFields.push(field as string);
    return this;
  }

  public appendField<T>(key: string, value: T): this {
    Logger.log("DEBUG", `Field ${key} added to return data`);
    this.data[key] = value;
    return this;
  }

  public renameField<K extends keyof T>(from: K, to: string): this {
    Logger.log("DEBUG", `Renaming field ${from.toString()} to ${to}`);
    if (this.data.hasOwnProperty(from)) {
      this.data[to] = this.data[from as string];
      delete this.data[from as string];
      this.renamedFields[from as string] = to;
    }

    return this;
  }

  public getData<ExtraFields extends Record<string, any> = {}>(): T &
    ExtraFields {
    type RenamedFields = {
      [K in keyof typeof this.renamedFields as (typeof this.renamedFields)[K]]: T[K];
    };

    return this.data as T & ExtraFields & RenamedFields;
  }
}
