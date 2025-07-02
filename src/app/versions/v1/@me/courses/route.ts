import { Validate } from "@/app/http/requests/request";
import { UserDTO } from "@/app/dto/user/user.dto";
import { CourseDTO } from "@/app/dto/course/course.dto";
import { Request, Response } from "express";
import RoleMiddleware from "@/app/middleware/role.middleware";
import CourseRequest from "@/app/http/requests/course/course.request";
import CourseService from "@/app/services/course/course.service";
import CourseResponse from "@/app/http/responses/course/course.response";
import Guard from "@/app/utils/type-guards";
import CourseChatRoute from "./discussions/route";
import Controller, { Post, Route } from "@/app/utils/controller";

@Route("/courses")
export default class CourseRouter extends Controller {
  constructor(protected readonly service = new CourseService()) {
    super();
  }

  @Validate(CourseRequest, (req) => ({
    appendFields: {
      createdById: (req.user as UserDTO).id,
    },
    optionalFields: ["banner_url", "demo_video_url", "archived"],
  }))
  @Post("/", [new RoleMiddleware(["CAN_POST_COURSE"])])
  async create(req: Request, res: Response) {
    const data = await this.service.create(req.body);

    if (Guard.isNull(data)) {
      throw new Error("Cannot create course");
    }

    return res.json(new CourseResponse(Guard.assumeAs<CourseDTO>(data)).make());
  }

  public route(): void {
    this.router.use(new CourseChatRoute().getRouter());
  }
}
