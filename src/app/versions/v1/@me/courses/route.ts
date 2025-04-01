import { Request, Response } from "express";
import BaseRouter, { Post, Route } from "@/app/utils/BaseRouter";
import RoleMiddleware from "@/app/middleware/RoleMiddleware";

@Route("/courses")
export default class CourseRouter extends BaseRouter {
  constructor() {
    super();
  }

  @Post("/", [
    new RoleMiddleware(["CAN_POST_COURSE", "CAN_CREATE_PAID_COURSE"]),
  ])
  async create(req: Request, res: Response) {
    res.json({ message: "ok" });
  }

  public route(): void {}
}
