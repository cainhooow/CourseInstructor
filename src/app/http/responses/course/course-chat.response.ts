import { CourseChatDTO } from "@/app/dto/course/course-chat.dto";
import { Response } from "../response";

export default class CourseChatResponse extends Response {
  constructor(protected readonly data: CourseChatDTO | CourseChatDTO[]) {
    super();
  }

  protected makeData<_T>(data: CourseChatDTO) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      courseId: data.courseId,
    };
  }
}
