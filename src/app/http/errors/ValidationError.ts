import { BaseError } from "./BaseError";

export default class ValidationError extends BaseError {
  constructor(public errors: string[]) {
    super("validation.error");
    this.name = "ValidationError";
  }
}
