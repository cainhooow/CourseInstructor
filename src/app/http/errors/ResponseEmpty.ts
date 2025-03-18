import { BaseError } from "./BaseError";

export default class ResponseEmpty extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}
