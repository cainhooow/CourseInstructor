import { Request, Response } from "express";
import { UserDTO } from "@/app/dto/user/UserDTO";
import BaseRouter, { Get, Post, Put, Route } from "@/app/utils/BaseRouter";
import ProfileService from "@/app/services/user/ProfileService";
import { UserProfileDTO } from "@/app/dto/user/UserProfileDTO";
import UserProfileResponse from "@/app/http/responses/user/UserProfileResponse";
import UserProfileRequest from "@/app/http/requests/user/UserProfileRequest";
import { Validatate } from "@/app/http/requests/Request";

@Route("/profile")
export default class ProfileRouter extends BaseRouter {
  constructor(protected readonly service = new ProfileService()) {
    super();
  }

  @Get("/")
  async index(req: Request, res: Response) {
    const authUser = req.user as UserDTO;
    const user = (await this.service.findByUserId(
      authUser.id
    )) as UserProfileDTO;

    res.json(new UserProfileResponse(user).make());
  }

  @Post("/")
  @Validatate(UserProfileRequest, (req) => ({
    appendFields: {
      userId: (req.user as UserDTO).id,
    },
  }))
  async create(req: Request, res: Response) {
    const data = await this.service.create(req.body);
    res.json(new UserProfileResponse(data).make());
  }

  @Put("/update")
  @Validatate(UserProfileRequest, {
    removeFields: ["type"],
  })
  async update(req: Request, res: Response) {
    const user = req.user as UserDTO & { Profile: UserProfileDTO };
    const data = await this.service.update(user.Profile.id, user.id, req.body);
    res.json(new UserProfileResponse(data as UserProfileDTO).make());
  }

  public route(): void {}
}
