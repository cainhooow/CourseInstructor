import CourseChatRepository, {
  CreatableCourseChat,
} from "@/app/repositories/course/course-chat.repository";
import CourseService from "./course.service";
import Guard from "@/app/utils/type-guards";

export default class CourseChatService {
  constructor(
    protected repository = new CourseChatRepository(),
    protected service = new CourseService()
  ) {}

  async create({
    id,
    name,
    description,
    courseId,
    userId,
  }: CreatableCourseChat & { userId: string }) {
    const course = await this.service.findById(courseId);
    if (Guard.isNull(course)) {
      throw new Error("Cannot find course");
    }

    if (course?.created_by.id !== userId) {
      throw new Error("This course does not belong to this user");
    }

    return await this.repository.create({ id, name, description, courseId });
  }
}
