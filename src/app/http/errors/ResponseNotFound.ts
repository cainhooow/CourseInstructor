import { BaseError } from "./BaseError";

export default class ResponseNotFound extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}
