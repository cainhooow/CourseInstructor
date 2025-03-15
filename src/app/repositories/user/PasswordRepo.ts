import { $ } from "@/app/database";
import { UserPasswordDTO } from "@/app/dto/user/UserPasswordDTO";
import Repository from "../Repository";
import { Password, Prisma } from "@prisma/client";

export type CreatablePassword = Omit<
  UserPasswordDTO,
  "id" | "created_at" | "updated_at"
>;

export default class PasswordRepository extends Repository<
  Password,
  Prisma.PasswordInclude
> {
  public async onlyActive(userId: string) {
    const includes = this.getIncludes();
    const data = await $.password.findFirst({
      where: {
        AND: [{ userId }, { active: true }],
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.PasswordGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async findById(id: string) {
    const includes = this.getIncludes();

    const data = await $.password.findUnique({
      where: {
        id,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.PasswordGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async setActive(active: boolean, id: string) {
    const includes = this.getIncludes();

    const data = await $.password.update({
      where: {
        id,
      },
      data: {
        active,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.PasswordGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async create(password: CreatablePassword) {
    const data = await $.password.create({
      data: password,
    });

    await $.$disconnect();
    return data;
  }
}
