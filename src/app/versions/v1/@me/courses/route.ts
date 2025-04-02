import { Request, Response } from "express";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import RoleMiddleware from "@/app/middleware/RoleMiddleware";
import { Validatate } from "@/app/http/requests/Request";
import CourseRequest from "@/app/http/requests/course/CourseRequest";
import { UserDTO } from "@/app/dto/user/UserDTO";

@Route("/courses")
export default class CourseRouter extends BaseRouter {
  constructor() {
    super();
  }

  @Post("/", [
    new RoleMiddleware(["CAN_POST_COURSE", "CAN_CREATE_PAID_COURSE"]),
  ])
  @Validatate(CourseRequest, (req) => ({
    appendFields: {
      userId: (req.user as UserDTO).id,
    },
  }))
  async create(req: Request, res: Response) {
    res.json({ message: "ok" });
  }

  public route(): void {}
}
