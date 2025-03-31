import { Request, Response } from "express";
import AddressService from "@/app/services/user/AddressService";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import UserAddressRequest from "@/app/http/requests/user/UserAddressRequest";
import UserAddressResponse from "@/app/http/responses/user/UserAddressResponse";
import { UserDTO } from "@/app/dto/user/UserDTO";

@Route("/address")
export default class AddressRouter extends BaseRouter {
  constructor(protected readonly service = new AddressService()) {
    super();
  }

  @Post("/")
  async create(req: Request, res: Response) {
    const validator = new UserAddressRequest(req);
    await validator.validateAsync();

    const user = req.user as UserDTO;

    const data = await this.service.create(
      validator.appendField("userId", user.id).getData()
    );

    res.json(new UserAddressResponse(data).make());
  }

  public route(): void {}
}
