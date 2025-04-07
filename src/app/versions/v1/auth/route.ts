import type { Request, Response } from "express";
import Controller, { Post, Route } from "@/app/utils/controller";
import AuthLocalRouter from "./local/route";
import AuthService from "@/app/services/system/auth.service";
import RefreshTokenRequest from "@/app/http/requests/auth/refresh-token.request";
import { Validate } from "@/app/http/requests/request";

@Route("/auth")
export default class AuthRouter extends Controller {
  constructor(protected readonly authService = new AuthService()) {
    super();
  }

  @Post("/refresh")
  @Validate(RefreshTokenRequest)
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
