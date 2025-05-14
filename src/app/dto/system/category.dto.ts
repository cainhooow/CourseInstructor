import { CourseDTO } from "../course/course.dto";

export type CategoryDTO = {
  id: string;
  name: string;
  description: string;

  created_at: Date;
  updated_at: Date;
};

export type CategoryWithCoursesDTO = CategoryDTO & {
  courses: CourseDTO[];
};
