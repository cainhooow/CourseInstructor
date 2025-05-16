import { FlagsDTO } from "@/app/dto/system/flags.dto";
import Repository from "../repository";
import { Flag, Prisma } from "@prisma/client";
import { $ } from "@/app/database";

export type CreatableFlag = Omit<FlagsDTO, "id" | "created_at" | "updated_at">;

export default class FlagRepository extends Repository<
  Flag,
  Prisma.FlagInclude
> {
  public async index() {
    const includes = this.getIncludes();

    const data = await $.flag.findMany({
      include: includes,
    });

    return data as Prisma.FlagGetPayload<{ include: typeof includes }>[] | null;
  }

  public async selectOnly(flags: CreatableFlag[]) {
    const includes = this.getIncludes();

    const data = await $.flag.findMany({
      where: {
        name: {
          in: flags.map((flag) => flag.name),
        },
      },
      include: includes,
    });

    return data as Prisma.FlagGetPayload<{ include: typeof includes }>[] | null;
  }
}
