import { $ } from "@/app/database";
import { UserDTO } from "@/app/dto/user/user.dto";
import { Prisma, User } from "@prisma/client";
import Repository from "../temp/repository";
import { FlagsDTO } from "@/app/dto/system/flags.dto";

type CreatableUser = Omit<UserDTO, "id" | "created_at" | "updated_at">;

export default class UserRepository extends Repository<
  User,
  Prisma.UserInclude
> {
  public async findById(id: string) {
    const includes = this.getIncludes();
    const data = await $.user.findUnique({
      where: {
        id,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.UserGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async findByEmail(email: string) {
    const includes = this.getIncludes();

    const data = await $.user.findUnique({
      where: {
        email,
      },
      include: this.getIncludes(),
    });

    await $.$disconnect();
    return data as Prisma.UserGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async createWithPassword(user: CreatableUser, password: string) {
    const includes = this.getIncludes();

    const data = await $.user.create({
      data: {
        ...user,
        Password: {
          create: {
            password: password,
          },
        },
      },
      include: includes,
    });

    return data as Prisma.UserGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async createWithFlags(
    user: CreatableUser,
    flags: Omit<FlagsDTO, "created_at" | "updated_at">[]
  ) {
    const includes = this.getIncludes();

    const data = await $.user.create({
      data: {
        ...user,
        Flags: {
          connect: flags.map((flag) => ({ id: flag.id })),
        },
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.UserGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async create(user: CreatableUser) {
    const data = await $.user.create({
      data: user,
    });

    await $.$disconnect();
    return data;
  }
}
