import Request from "../Request";
import { Request as ExpressRequest } from "express";

export default class UserBillingRequest extends Request {
  constructor(protected req: ExpressRequest) {
    super(req, ["name", "document"]);
  }

  protected rules(): Record<string, string> {
    return {
      name: "string|min:5|max:80",
      document: "string|min:5|max:18",
    };
  }
}
