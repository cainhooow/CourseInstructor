import { Course, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";
import { CourseDTO } from "@/app/dto/course/course.dto";

export type CreatableCourse = Omit<CourseDTO, 'created_at' | 'updated_at'>;

export default class CourseRepository extends Repository<
  Course,
  Prisma.CourseInclude
> {
  public async create(course: CreatableCourse) {
    const includes = this.getIncludes();

    const data = await $.course.create({
      data: { ...course },
      include: includes,
    });

    return data as Prisma.CourseGetPayload<{
      include: typeof includes;
    }> | null;
  }
}
