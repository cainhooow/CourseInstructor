import BaseRouter, { Get, Post, Put, Route } from "@/app/utils/base-router";
import ProfileService from "@/app/services/user/profile.service";
import UserProfileResponse from "@/app/http/responses/user/user-profile.response";
import UserProfileRequest from "@/app/http/requests/user/user-profile.request";
import { Request, Response } from "express";
import { Validatate } from "@/app/http/requests/request";
import { UserDTO } from "@/app/dto/user/user.dto";
import { UserProfileDTO } from "@/app/dto/user/user-profile.dto";

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
