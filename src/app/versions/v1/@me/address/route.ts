import { Request as ExpressRequest, Response } from "express";
import AddressService from "@/app/services/user/AddressService";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import UserAddressRequest from "@/app/http/requests/user/UserAddressRequest";
import UserAddressResponse from "@/app/http/responses/user/UserAddressResponse";
import { UserDTO } from "@/app/dto/user/UserDTO";
import { Validatate } from "@/app/http/requests/Request";

@Route("/address")
export default class AddressRouter extends BaseRouter {
  constructor(protected readonly service = new AddressService()) {
    super();
  }

  @Post("/")
  @Validatate(UserAddressRequest, (req: ExpressRequest) => ({
    appendFields: { userId: (req.user as UserDTO).id },
  }))
  async create(req: ExpressRequest, res: Response) {
    const data = await this.service.create(req.body);
    res.json(new UserAddressResponse(data).make());
  }

  public route(): void {}
}
