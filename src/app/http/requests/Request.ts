import ValidationHelper from "@/app/helpers/ValidationHelper";
import { Validator } from "@courseinstructor/validator";
import { ValidationError } from "../errors/ValidationError";
import { Request as ExpressRequest } from "express";

export interface IRequest {
  validateAsync(): Promise<boolean>;
  hasErrors(): string[];
  getData<T>(): T;
}

export default class Request implements IRequest {
  protected errors: string[] = [];
  protected data: Record<string, any>;

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
      if (!(field in this.data)) {
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
        const validator = new Validator(rule, field, value, this.req.t);
        const error = validator.validate();

        if (error) {
          this.errors.push(error);
        }

        const uniqueMatch = rule.match(/^unique:([\w_]+)$/);
        if (uniqueMatch) {
          const tableName = uniqueMatch[1];
          const isUnique = await this.helper.unique(tableName, field, value);

          if (!isUnique) {
            this.errors.push(
              `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            );
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

  public getData<T>(): T {
    return this.data as T;
  }
}
