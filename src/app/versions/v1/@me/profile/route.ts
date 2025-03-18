import { Request, Response } from "express";
import BaseRouter from "@/app/utils/BaseRouter";
import ProfileService from "@/app/services/user/ProfileService";
import { UserDTO } from "@/app/dto/user/UserDTO";
import UserProfileResponse from "@/app/http/responses/user/UserProfileResponse";
import { UserProfileDTO } from "@/app/dto/user/UserProfileDTO";

export default class ProfileRouter extends BaseRouter {
  constructor(protected service = new ProfileService()) {
    super({
      prefix: "/profile",
    });
  }

  private async index(req: Request, res: Response) {
    const authUser = req.user as UserDTO;
    const user = (await this.service.findByUserId(
      authUser.id
    )) as UserProfileDTO;

    res.json(new UserProfileResponse(user).make());
  }

  public route(): void {
    this.router.get("/", this.index.bind(this));
  }
}
