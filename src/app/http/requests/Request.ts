import ValidationHelper from "@/app/helpers/ValidationHelper";
import { Validator } from "@courseinstructor/validator";
import { ValidationError } from "../errors/ValidationError";
import { Request as ExpressRequest } from "express";
import Logger from "@/app/utils/Logger";

export interface IRequest {
  validateAsync(): Promise<boolean>;
  hasErrors(): string[];
  getData<T>(): T;
}

export default class Request implements IRequest {
  protected errors: string[] = [];
  protected data: Record<string, any>;

  private removedFields: string[] = [];
  private optionalFields: string[] = [];

  constructor(
    protected req: ExpressRequest,
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

    this.optionalFields.includes(field);
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

  public removeField(field: string) {
    Logger.log("DEBUG", `Field ${field} deleted from request.body`);

    if (this.fieldIsRemoved(field)) {
      throw new Error(`Field ${field} already in ignore list`);
    }

    this.removedFields.push(field);
    return this;
  }

  public appendField<T>(key: string, value: T): this {
    Logger.log("DEBUG", `Field ${key} added to return data`);
    this.data[key] = value;
    return this;
  }

  public renameField<T extends keyof ReturnType<typeof this.rules>>(
    from: T,
    to: string
  ): this {
    Logger.log("DEBUG", `Renaming field ${from} to ${to}`);
    if (this.data.hasOwnProperty(from)) {
      this.data[to] = this.data[from];
      delete this.data[from];
    }

    return this;
  }

  public getData<T>(): T {
    return this.data as T;
  }
}
