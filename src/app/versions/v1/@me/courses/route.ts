import Controller, { Post, Route } from "@/app/utils/controller";
import RoleMiddleware from "@/app/middleware/role.middleware";
import CourseRequest from "@/app/http/requests/course/course.request";
import CourseService from "@/app/services/course/course.service";
import CourseResponse from "@/app/http/responses/course/course.response";
import { Request, Response } from "express";
import { Validate } from "@/app/http/requests/request";
import { UserDTO } from "@/app/dto/user/user.dto";
import { CourseDTO } from "@/app/dto/course/course.dto";

@Route("/courses")
export default class CourseRouter extends Controller {
  constructor(protected readonly service = new CourseService()) {
    super();
  }

  @Post("/", [new RoleMiddleware(["CAN_POST_COURSE"])])
  @Validate(CourseRequest, (req) => ({
    appendFields: {
      createdById: (req.user as UserDTO).id,
    },
    optionalFields: ["banner_url", "demo_video_url", "archived"],
  }))
  async create(req: Request, res: Response) {
    const data = await this.service.create(req.body);
    return res.json(new CourseResponse(data as unknown as CourseDTO).make());
  }

  public route(): void {}
}
