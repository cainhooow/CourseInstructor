import { ProviderType } from "@prisma/client";

export type LoginProviderDTO = {
  id: string;
  name: ProviderType;
  userId: string;

  created_at: Date;
  updated_at: Date;
};
