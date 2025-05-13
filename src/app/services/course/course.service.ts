import CourseRepository, {
  CreatableCourse,
} from "@/app/repositories/course/course.repository";
import Guard from "@/app/utils/type-guards";

export default class CourseService {
  constructor(protected readonly repository = new CourseRepository()) {}

  public async findById(id: string) {
    return await this.repository.includes(["created_by"]).findById(id);
  }

  public async create(course: CreatableCourse) {
    course.tags = Guard.assumeAs<string>(course.tags).slice().split(" ");
    return await this.repository.includes(["created_by"]).create(course);
  }
}
