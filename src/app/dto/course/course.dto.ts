export type CourseDTO = {
  id: string;
  name: string;
  description: string;
  banner_url?: string;
  demo_video_url?: string;
  tags: string[];
  stock: number;
  archived: boolean;

  createdById: string;
  createdAt: string;
  updatedAt: string;
};
