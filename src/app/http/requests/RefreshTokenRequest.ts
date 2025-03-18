import Request from "./Request";
import { Request as ExpressRequest } from "express";

export default class RefreshTokenRequest extends Request {
  constructor(protected req: ExpressRequest) {
    super(req, ["refreshToken"]);
  }

  protected rules(): Record<string, string> {
      return {
          "refreshToken": "string|min:25"
      }
  }
}
