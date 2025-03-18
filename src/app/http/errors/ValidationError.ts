import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
  constructor(public errors: string[]) {
    super("validation.error");
    this.name = "ValidationError";
  }
}
