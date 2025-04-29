import { Course, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";
import { CourseDTO } from "@/app/dto/course/course.dto";
import Guard from "@/app/utils/type-guards";

export type CreatableCourse = Omit<CourseDTO, 'created_at' | 'updated_at'>;

export default class CourseRepository extends Repository<
  Course,
  Prisma.CourseInclude
> {
  public async create(course: CreatableCourse) {
    const includes = this.getIncludes();
    const data = await $.course.create({
      data: {
        ...course,
        tags: Guard.assumeAs<string>(course.tags).slice().split(" "),
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.CourseGetPayload<{
      include: typeof includes;
    }> | null;
  }
}
