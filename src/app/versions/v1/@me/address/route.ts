import BaseRouter, { Post, Route } from "@/app/utils/base-router";
import { Request as ExpressRequest, Response } from "express";
import { UserDTO } from "@/app/dto/user/user.dto";
import { Validate } from "@/app/http/requests/request";
import AddressService from "@/app/services/user/address.service";
import UserAddressRequest from "@/app/http/requests/user/user-address.request";
import UserAddressResponse from "@/app/http/responses/user/user-address.response";

@Route("/address")
export default class AddressRouter extends BaseRouter {
  constructor(protected readonly service = new AddressService()) {
    super();
  }

  @Post("/")
  @Validate(UserAddressRequest, (req: ExpressRequest) => ({
    appendFields: { userId: (req.user as UserDTO).id },
  }))
  async create(req: ExpressRequest, res: Response) {
    const data = await this.service.create(req.body);
    res.json(new UserAddressResponse(data).make());
  }

  public route(): void {}
}
