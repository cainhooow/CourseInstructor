import { Request, Response } from "express";
import { UserDTO } from "@/app/dto/user/UserDTO";
import BaseRouter from "@/app/utils/BaseRouter";
import ProfileService from "@/app/services/user/ProfileService";
import { UserProfileDTO } from "@/app/dto/user/UserProfileDTO";
import UserProfileResponse from "@/app/http/responses/user/UserProfileResponse";
import UserProfileRequest from "@/app/http/requests/user/UserProfileRequest";

export default class ProfileRouter extends BaseRouter {
  constructor(protected readonly service = new ProfileService()) {
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

  private async update(req: Request, res: Response) {
    const validator = new UserProfileRequest(req).removeField("type");
    await validator.validateAsync();

    const user = req.user as UserDTO & { Profile: UserProfileDTO };

    const data = await this.service.update(
      user.Profile.id,
      user.id,
      validator.getData()
    );

    res.json(new UserProfileResponse(data as UserProfileDTO).make());
  }

  public route(): void {
    this.router.get("/", this.index.bind(this));
    this.router.post("/", this.create.bind(this));
    this.router.post("/update", this.update.bind(this));
  }
}
