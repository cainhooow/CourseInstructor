import { BaseError } from "./BaseError";

export default class ResponseUnauthorized extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}
