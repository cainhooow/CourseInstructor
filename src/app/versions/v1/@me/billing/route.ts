import Controller, { Post, Route } from "@/app/utils/controller";
import { UserDTO } from "@/app/dto/user/user.dto";
import { Validate } from "@/app/http/requests/request";
import { Request, Response } from "express";
import UserBillingRequest from "@/app/http/requests/user/user-billing.request";
import UserBillingResponse from "@/app/http/responses/user/user-billing.response";
import BillingService from "@/app/services/user/billing.service";

@Route("/billing")
export default class BillingRouter extends Controller {
  constructor(protected readonly service = new BillingService()) {
    super();
  }

  @Post("/")
  @Validate(UserBillingRequest, (req) => ({
    appendFields: {
      userId: (req.user as UserDTO).id,
    },
    renameFields: {
      address: "addressId",
    },
  }))
  async create(req: Request, res: Response) {
    const data = await this.service.create(req.body);
    res.json(new UserBillingResponse(data).make());
  }

  public route(): void {}
}
