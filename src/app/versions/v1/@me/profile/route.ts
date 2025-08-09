import Controller, {
  Get,
  Patch,
  Post,
  Put,
  Route,
} from "@/app/utils/controller";
import { Response } from "express";
import { Validate } from "@/app/http/requests/request";
import { UserDTO } from "@/app/dto/user/user.dto";
import { UserProfileDTO } from "@/app/dto/user/user-profile.dto";
import { ProfileType } from "@prisma/client";
import Guard, { TypeGuards } from "@/app/utils/type-guards";
import ProfileService from "@/app/services/user/profile.service";
import UserProfileResponse from "@/app/http/responses/user/user-profile.response";
import UserProfileRequest from "@/app/http/requests/user/user-profile.request";
import SettingsService from "@/app/services/system/settings.service";
// import RoleMiddleware from "@/app/middleware/role.middleware";

@Route("/profile")
export default class ProfileRouter extends Controller {
  constructor(protected readonly service = new ProfileService()) {
    super();
  }

  @Get("/")
  async index(req: TypeGuards.AuthRequest, res: Response) {
    const authUser = Guard.toUser<UserDTO>(req.user);

    const user = await this.service.findByUserId(authUser.id);
    if (Guard.isNull(user)) {
      throw new Error("Cannot find user");
    }

    res.json(
      new UserProfileResponse(Guard.assumeAs<UserProfileDTO>(user)).make()
    );
  }

  @Post("/")
  @Validate(UserProfileRequest, (req) => ({
    appendFields: {
      userId: (req.user as UserDTO).id,
    },
    removeFields: (service = new SettingsService()) => {
      service.findByKey("ALLOW_CREATE_TEACHER_PROFILE")
      .then(data => {
        if (data?.value === "allow") {
          return ["type"]
        }
      }).catch((err) => {
        throw new Error(err);
      });

      return []
    },
  }))
  async create(req: TypeGuards.AuthRequest, res: Response) {
    const data = await this.service.create(req.body);
    if (Guard.isNull(data)) {
      throw new Error("Cannot find user");
    }

    res.json(new UserProfileResponse(data).make());
  }

  @Put("/update")
  @Validate(UserProfileRequest, {
    removeFields: ["type"],
  })
  async update(req: TypeGuards.AuthRequest, res: Response) {
    const user = Guard.assignObject<UserDTO, "Profile", UserProfileDTO>(
      req.user as UserDTO
    );

    const data = await this.service.update(user.Profile.id, user.id, req.body);
    if (Guard.isNull(data)) {
      throw new Error("cannot find and update user profile");
    }

    res.json(
      new UserProfileResponse(Guard.assumeAs<UserProfileDTO>(data)).make()
    );
  }

  @Patch("/update")
  @Validate(UserProfileRequest)
  async changeToTeacher(req: TypeGuards.AuthRequest, res: Response) {
    const user = Guard.assignObject<UserDTO, "Profile", UserProfileDTO>(
      req.user
    );

    const data = await this.service.setType(
      user.Profile.id,
      ProfileType.TEACHER
    );
    if (Guard.isNull(data)) {
      throw new Error("cannot find and update user profile");
    }

    res.json(
      new UserProfileResponse(Guard.assumeAs<UserProfileDTO>(data)).make()
    );
  }

  public route(): void {}
}
