import { UserDTO } from "@/app/dto/user/UserDTO";
import UserBillingRequest from "@/app/http/requests/user/UserBillingRequest";
import UserBillingResponse from "@/app/http/responses/user/UserBillingResponse";
import BillingService from "@/app/services/user/BillingService";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import { Request, Response } from "express";

@Route("/billing")
export default class BillingRouter extends BaseRouter {
  constructor(protected readonly service = new BillingService()) {
    super();
  }

  @Post("/")
  async create(req: Request, res: Response) {
    const validator = new UserBillingRequest(req);
    await validator.validateAsync();

    const user = req.user as UserDTO;
    const data = await this.service.create(
      validator
        .renameField("address", "addressId")
        .appendField("userId", user.id)
        .getData<{ addressId: string }>()
    );

    res.json(new UserBillingResponse(data).make());
  }

  public route(): void {}
}
