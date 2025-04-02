import { ProfileType } from "@prisma/client";

export type UserProfileDTO = {
  id: string;
  bio: string;
  type: ProfileType;
  userId: string;

  created_at: Date;
  updated_at: Date;
};
