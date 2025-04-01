import { FlagsType } from "@prisma/client";

export const DefaultFlags = () => {
  const items = Object.values(FlagsType);
  return items.map((item) => ({ name: item }));
};