import Request from "../Request";
import { Request as ExpressRequest } from "express";

type TUserBillingRequest = {
  name: string;
  document: string;
  address: string;
  userId: string;
};
export default class UserBillingRequest extends Request<TUserBillingRequest> {
  constructor(protected readonly req: ExpressRequest) {
    super(req, ["name", "document", "address"]);
  }

  protected rules(): Record<string, string> {
    return {
      name: "string|min:5|max:150",
      document: "string|min:5|max:18",
      address: "string|min:15",
    };
  }
}
