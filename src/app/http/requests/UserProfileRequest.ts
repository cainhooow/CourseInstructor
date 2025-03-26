import Request from "./Request";
import { Request as ExpressRequest } from "express";

export default class UserProfileRequest extends Request {
  constructor(protected req: ExpressRequest) {
    super(req, ["bio", "type"]);
  }

  protected rules(): Record<string, string> {
    return {
      bio: "string|min:5|max:1500",
      type: "string|min:4|max:7|transform:upper",
    };
  }
}
