import { Response } from "express";
import { Validate } from "@/app/http/requests/request";
import { CourseChatDTO } from "@/app/dto/course/course-chat.dto";
import { UserDTO } from "@/app/dto/user/user.dto";
import Guard, { TypeGuards } from "@/app/utils/type-guards";
import CourseChatRequest from "@/app/http/requests/course/course-chat.request";
import CourseChatService from "@/app/services/course/course-chat.service";
import CourseChatResponse from "@/app/http/responses/course/course-chat.response";
import RoleMiddleware from "@/app/middleware/role.middleware";
import Controller, { Post, Route } from "@/app/utils/controller";

@Route("/discussions")
export default class CourseChatRoute extends Controller {
  constructor(protected readonly service = new CourseChatService()) {
    super();
  }

  @Validate(CourseChatRequest, (req) => ({
    appendFields: {
      userId: Guard.assumeAs<UserDTO>(req.user).id,
    },
    renameFields: {
      course: "courseId",
    },
  }))
  @Post("/", [new RoleMiddleware(["CAN_CREATE_CHAT", "CAN_EDIT_COURSE"])])
  async create(req: TypeGuards.AuthRequest, res: Response) {
    const data = await this.service.create(req.body);

    if (Guard.isNull(data)) {
      throw new Error("Could not create course chat");
    }

    return res.json(
      new CourseChatResponse(Guard.assumeAs<CourseChatDTO>(data)).make()
    );
  }

  public route(): void {}
}
