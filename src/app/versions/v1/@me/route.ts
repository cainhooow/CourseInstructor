import Controller, { Get, Middlewares, Route } from "@/app/utils/controller";
import { Request, Response } from "express";
import { UserDTO } from "@/app/dto/user/user.dto";
import UserResponse from "@/app/http/responses/user/user.response";
import AuthMiddleware from "@/app/middleware/auth.middleware";
import ProfileRouter from "./profile/route";
import BillingRouter from "./billing/route";
import AddressRouter from "./address/route";
import CourseRouter from "./courses/route";

@Route("/@me")
@Middlewares([new AuthMiddleware("jwt")])
export default class MeRouter extends Controller {
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
