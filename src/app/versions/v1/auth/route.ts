import type { Request, Response } from "express";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import AuthLocalRouter from "./local/route";
import AuthService from "@/app/services/system/AuthService";
import RefreshTokenRequest from "@/app/http/requests/auth/RefreshTokenRequest";

@Route("/auth")
export default class AuthRouter extends BaseRouter {
  constructor(protected readonly authService = new AuthService()) {
    super();
  }

  @Post("/refresh")
  async refreshToken(req: Request, res: Response) {
    const validator = new RefreshTokenRequest(req);
    const validated = await validator.validateAsync();

    if (!validated) {
      res.status(400).json({ errors: validator.hasErrors() });
      return;
    }

    const data = validator.getData<{ refreshToken: string }>();
    const { refreshToken, accessToken } = await this.authService.renew(
      data.refreshToken
    );

    res.json({ refreshToken, accessToken });
  }

  public route(): void {
    this.router.use(new AuthLocalRouter().getRouter());
  }
}
