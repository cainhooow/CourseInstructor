import { CourseChat, Prisma } from "@prisma/client";
import Repository from "../repository";
import { CourseChatDTO } from "@/app/dto/course/course-chat.dto";
import { $ } from "@/app/database";

export type CreatableCourseChat = Omit<
  CourseChatDTO,
  "created_at" | "updated_at"
>;

export default class CourseChatRepository extends Repository<
  CourseChat,
  Prisma.CourseChatInclude
> {
  public async create(chat: CreatableCourseChat) {
    const includes = this.getIncludes();

    const data = await $.courseChat.create({
      data: chat,
      include: includes,
    });

    return data as Prisma.CourseChatGetPayload<{ include: typeof includes }>;
  }
}
