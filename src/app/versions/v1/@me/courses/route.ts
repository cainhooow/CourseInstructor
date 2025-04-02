import { Request, Response } from "express";
import BaseRouter, { Post, Route } from "@/app/utils/base-router";
import RoleMiddleware from "@/app/middleware/role.middleware";
import { Validatate } from "@/app/http/requests/request";
import CourseRequest from "@/app/http/requests/course/course.request";
import { UserDTO } from "@/app/dto/user/user.dto";

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
