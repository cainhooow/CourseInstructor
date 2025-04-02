import { BaseError } from "./base.error";

export default class ResponseUnauthorized extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}
