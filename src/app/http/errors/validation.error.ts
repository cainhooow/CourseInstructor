import { BaseError } from "./base.error";

export default class ValidationError extends BaseError {
  constructor(public errors: string[]) {
    super("validation.error");
    this.name = "ValidationError";
  }
}
