import Controller, { Post, Route } from "@/app/utils/controller";
import { Request as ExpressRequest, Response } from "express";
import { UserDTO } from "@/app/dto/user/user.dto";
import { Validate } from "@/app/http/requests/request";
import AddressService from "@/app/services/user/address.service";
import UserAddressRequest from "@/app/http/requests/user/user-address.request";
import UserAddressResponse from "@/app/http/responses/user/user-address.response";
import Guard from "@/app/utils/type-guards";

@Route("/address")
export default class AddressRouter extends Controller {
  constructor(protected readonly service = new AddressService()) {
    super();
  }

  @Post("/")
  @Validate(UserAddressRequest, (req: ExpressRequest) => ({
    appendFields: { userId: Guard.assumeAs<UserDTO>(req.user).id },
  }))
  async create(req: ExpressRequest, res: Response) {
    const data = await this.service.create(req.body);

    if (Guard.isNull(data)) {
      throw new Error("Address is not created");
    }

    res.json(new UserAddressResponse(data).make());
  }

  public route(): void {}
}
