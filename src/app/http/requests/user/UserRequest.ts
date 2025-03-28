import Request from "../Request";
import { Request as ExpressRequest } from "express";

type TUserRequest = {
  email: string;
  password: string;
  display_name: string;
};

export default class UserRequest extends Request<TUserRequest> {
  constructor(protected req: ExpressRequest) {
    super(req, [""]);
  }

  protected rules(): Record<string, string> {
    return {
      email: "string|min:8|email|unique:User",
      password: "string|min:8",
      display_name: "string|min:8",
    };
  }
}
