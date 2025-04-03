import { Course, Prisma } from "@prisma/client";
import Repository from "../temp/repository";

export default class CourseRepository extends Repository<
  Course,
  Prisma.CourseInclude
> {}
