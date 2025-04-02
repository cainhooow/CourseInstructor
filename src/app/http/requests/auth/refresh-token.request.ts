import Request from "../request";
import { Request as ExpressRequest } from "express";

type TRefreshTokenRequest = {
  refreshToken: string;
};

export default class RefreshTokenRequest extends Request<TRefreshTokenRequest> {
  constructor(protected req: ExpressRequest) {
    super(req, ["refreshToken"]);
  }

  protected rules(): Record<string, string> {
    return {
      refreshToken: "string|min:25",
    };
  }
}
