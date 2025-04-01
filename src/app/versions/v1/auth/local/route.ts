import { ProviderType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import passport from "passport";
import UserRequest from "@/app/http/requests/user/UserRequest";
import UserService from "@/app/services/user/UserService";
import UserResponse from "@/app/http/responses/user/UserResponse";
import AuthService from "@/app/services/system/AuthService";
import LoginProviderService from "@/app/services/user/LoginProviderService";
import Logger from "@/app/utils/Logger";
import PasswordService from "@/app/services/user/PasswordService";
import { Validatate } from "@/app/http/requests/Request";

@Route("/local")
export default class AuthLocalRouter extends BaseRouter {
  constructor(
    protected readonly service = new UserService(),
    protected readonly passwordService = new PasswordService(),
    protected readonly authService = new AuthService(),
    protected readonly providerService = new LoginProviderService()
  ) {
    super();
  }

  @Post("/")
  local(req: Request, res: Response, next: NextFunction) {
    const authService = this.authService;

    passport.authenticate("local", async function (err: any, user: any) {
      if (err) {
        return res.status(401).json(err);
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      try {
        const { accessToken, refreshToken } = await authService.login(user.id);

        return res.json(
          new UserResponse(user)
            .addField("token", accessToken)
            .addField("refreshToken", refreshToken)
            .make()
        );
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  }

  @Post("/register")
  @Validatate(UserRequest)
  async register(req: Request, res: Response) {
    const { email, display_name, password } = req.body;

    try {
      const createdUser = await this.service.createWithFlags({
        email,
        display_name,
      });

      if (!createdUser) {
        throw new Error("User not created");
      }

      await this.passwordService.create({ password, userId: createdUser.id });

      await this.providerService.create({
        name: ProviderType.LOCAL,
        userId: createdUser.id,
      });

      res.json(new UserResponse(createdUser as any).make());
    } catch (err) {
      Logger.log("ERROR", err);
      throw err;
    }
  }

  public route(): void {}
}
