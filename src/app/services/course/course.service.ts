import CourseRepository, {
  CreatableCourse,
} from "@/app/repositories/course/couse.repository";

export default class CourseService {
  constructor(protected readonly repository = new CourseRepository()) {}

  public async create(course: CreatableCourse) {
    return await this.repository.includes(["created_by"]).create(course);
  }
}
