import Request from "../Request";
import { Request as ExpressRequest } from "express";

type TUserProfileRequest = {
  bio: string;
  type: string;
};

export default class UserProfileRequest extends Request<TUserProfileRequest> {
  constructor(protected readonly req: ExpressRequest) {
    super(req, ["bio", "type"]);
  }

  protected rules(): Record<string, string> {
    return {
      bio: "string|min:5|max:1500",
      type: "string|min:4|max:7|transform:upper",
    };
  }
}
