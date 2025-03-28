import { ProviderType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { UserDTO } from "@/app/dto/user/UserDTO";
import BaseRouter from "@/app/utils/BaseRouter";
import passport from "passport";
import UserRequest from "@/app/http/requests/user/UserRequest";
import UserService from "@/app/services/user/UserService";
import UserResponse from "@/app/http/responses/user/UserResponse";
import AuthService from "@/app/services/system/AuthService";
import LoginProviderService from "@/app/services/user/LoginProviderService";

export default class AuthLocalRouter extends BaseRouter {
  constructor(
    protected service = new UserService(),
    protected authService = new AuthService(),
    protected providerService = new LoginProviderService()
  ) {
    super({ prefix: "/local" });
  }

  private local(req: Request, res: Response, next: NextFunction) {
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
        console.log(user)
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

  private async register(req: Request, res: Response) {
    const validator = new UserRequest(req);

    if (!(await validator.validateAsync())) {
      res.status(400).json({ errors: validator.hasErrors() });
      return;
    }

    const { email, display_name, password } = validator.getData<
      UserDTO & { password: string }
    >();

    try {
      const createdUser = await this.service.createWithPassword(
        {
          email,
          display_name,
        },
        password
      );

      if (!createdUser) {
        throw new Error("User not created");
      }

      await this.providerService.create({
        name: ProviderType.LOCAL,
        userId: createdUser.id,
      });

      res.json(new UserResponse(createdUser as any).make());
    } catch (err) {
      throw err;
    }
  }

  public route(): void {
    this.router.post("/", this.local.bind(this));
    this.router.post("/register", this.register.bind(this));
  }
}
