import { Request, Response, NextFunction } from "express";
import BaseRouter from "@/app/utils/BaseRouter";
import passport from "passport";
import UserRequest from "@/app/http/requests/UserRequest";
import UserService from "@/app/services/user/UserService";
import { UserDTO } from "@/app/dto/user/UserDTO";
import UserResponse from "@/app/http/responses/user/UserResponse";

export default class AuthLocalRouter extends BaseRouter {
  constructor(protected service = new UserService()) {
    super({ prefix: "/local" });
  }

  private local(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function (err: any, user: any) {
      if (err) {
        return res.status(401).json(err);
      }

      console.log(user);
    })(req, res, next);
  }

  private async register(req: Request, res: Response) {
    const validator = new UserRequest(req.body);

    if (!(await validator.validateAsync())) {
      res.status(400).json({ errors: validator.hasErrors() });
      return;
    }

    const { email, display_name, password } = validator.getData<
      UserDTO & { password: string }
    >();

    const data = await this.service.createWithPassword(
      {
        email,
        display_name,
      },
      password
    );

    res.json(new UserResponse(data as any).make());
  }

  public route(): void {
    this.router.post("/", this.local.bind(this));
    this.router.post("/register", this.register.bind(this));
  }
}
