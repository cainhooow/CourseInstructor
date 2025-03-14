import { FlagsType } from "@prisma/client";

export type FlagsDTO = {
  id: string;
  name: FlagsType;
  created_at: Date;
  updated_at: Date;
};
