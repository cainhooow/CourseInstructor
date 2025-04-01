import { Request, Response } from "express";

import { UserDTO } from "@/app/dto/user/UserDTO";
import UserResponse from "@/app/http/responses/user/UserResponse";
import AuthMiddleware from "@/app/middleware/AuthMiddleware";
import BaseRouter, { Get, Middlewares, Route } from "@/app/utils/BaseRouter";
import ProfileRouter from "./profile/route";
import BillingRouter from "./billing/route";
import AddressRouter from "./address/route";
import CourseRouter from "./courses/route";

@Route("/@me")
@Middlewares([new AuthMiddleware("jwt")])
export default class MeRouter extends BaseRouter {
  constructor() {
    super();
  }

  @Get("/")
  async index(req: Request, res: Response) {
    res.json(new UserResponse(req.user as UserDTO).make());
  }

  public route(): void {
    this.router.use(new ProfileRouter().getRouter());
    this.router.use(new BillingRouter().getRouter());
    this.router.use(new AddressRouter().getRouter());
    this.router.use(new CourseRouter().getRouter());
  }
}
