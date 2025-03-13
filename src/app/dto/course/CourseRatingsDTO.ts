export type CourseRatingDTO = {
  id: string;
  stars: number;
  userId: string;
  courseId: string;

  created_at: Date;
  updated_at: Date;
};

export type TeacherRatingDTO = {
  id: string;
  stars: number;
  raterId: string;
  teacherId: string;

  created_at: Date;
  updated_at: Date;
};