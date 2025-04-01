import { UserDTO } from "@/app/dto/user/UserDTO";
import { Validatate } from "@/app/http/requests/Request";
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
  @Validatate(UserBillingRequest, (req) => ({
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
