import { BaseError } from "./base.error";

export default class ResponseNotFound extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}
