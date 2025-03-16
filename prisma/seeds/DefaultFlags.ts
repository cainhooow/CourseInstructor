import { Flag, FlagsType } from "@prisma/client";
import { DefaultOmission } from "../seed";

export const DefaultFlags = () => {
  const items = Object.values(FlagsType);
  return items.map((item) => ({ name: item }));
};