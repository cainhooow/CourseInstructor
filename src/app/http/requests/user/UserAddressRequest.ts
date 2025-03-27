import Request from "../Request";
import { Request as ExpressRequest } from "express";

export default class UserAddressRequest extends Request {
  constructor(protected req: ExpressRequest) {
    super(req, ["country", "state", "city", "street", "address"]);
  }

  protected rules(): Record<string, string> {
    return {
      country: "string|min:2|max:4|transform:upper",
      state: "string|min:2|max:8|transform:upper",
      city: "string|min:2|max:20|transform:camel",
      street: "string|min:2|max:50|transform:camel",
      address: "string|min:2|max:150|transform:camel",
    };
  }
}
