import { Request, Response } from "express";
import BaseRouter from "@/app/utils/BaseRouter";
import ProfileService from "@/app/services/user/ProfileService";
import { UserDTO } from "@/app/dto/user/UserDTO";
import UserProfileResponse from "@/app/http/responses/user/UserProfileResponse";
import { UserProfileDTO } from "@/app/dto/user/UserProfileDTO";
import UserProfileRequest from "@/app/http/requests/UserProfileRequest";

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

  private async create(req: Request, res: Response) {
    const validator = new UserProfileRequest(req);

    if (!(await validator.validateAsync())) {
      res.json({ message: validator.hasErrors() });
      return;
    }

    const user = req.user as UserDTO;
    const data = await this.service.create(
      validator.appendField("userId", user.id).getData()
    );
    res.json(new UserProfileResponse(data).make());
  }

  public route(): void {
    this.router.get("/", this.index.bind(this));
    this.router.post("/", this.create.bind(this));
  }
}
