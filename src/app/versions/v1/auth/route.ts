import type { Request, Response } from "express";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import AuthLocalRouter from "./local/route";
import AuthService from "@/app/services/system/AuthService";
import RefreshTokenRequest from "@/app/http/requests/auth/RefreshTokenRequest";
import { Validatate } from "@/app/http/requests/Request";

@Route("/auth")
export default class AuthRouter extends BaseRouter {
  constructor(protected readonly authService = new AuthService()) {
    super();
  }

  @Post("/refresh")
  @Validatate(RefreshTokenRequest)
  async refreshToken(req: Request, res: Response) {
    const data = req.body;
    const { refreshToken, accessToken } = await this.authService.renew(
      data.refreshToken
    );

    res.json({ refreshToken, accessToken });
  }

  public route(): void {
    this.router.use(new AuthLocalRouter().getRouter());
  }
}
