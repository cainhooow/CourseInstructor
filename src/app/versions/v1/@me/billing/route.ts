import { UserDTO } from "@/app/dto/user/UserDTO";
import UserBillingRequest from "@/app/http/requests/user/UserBillingRequest";
import UserBillingResponse from "@/app/http/responses/user/UserBillingResponse";
import BillingService from "@/app/services/user/BillingService";
import BaseRouter from "@/app/utils/BaseRouter";
import { Request, Response } from "express";

export default class BillingRouter extends BaseRouter {
  constructor(protected service = new BillingService()) {
    super({ prefix: "/billing" });
  }

  private async create(req: Request, res: Response) {
    const validator = new UserBillingRequest(req);
    await validator.validateAsync();

    const user = req.user as UserDTO;
    const data = await this.service.create(validator.getData(), user.id);
    
    res.json(new UserBillingResponse(data).make());
  }

  public route(): void {
    this.router.post("/", this.create.bind(this));
  }
}
