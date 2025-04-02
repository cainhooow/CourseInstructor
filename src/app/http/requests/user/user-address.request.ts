import Request from "../request";
import { Request as ExpressRequest } from "express";

type TUserAddressRequest = {
  country: string;
  state: string;
  city: string;
  street: string;
  address: string;
};

export default class UserAddressRequest extends Request<TUserAddressRequest> {
  constructor(protected readonly req: ExpressRequest) {
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
