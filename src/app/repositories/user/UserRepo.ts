import { $ } from "@/app/database";
import { UserDTO } from "@dto/user/UserDTO";
import { Prisma, User } from "@prisma/client";
import Repository from "../Repository";

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
    }>;
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
    }>;
  }

  public async create(user: CreatableUser) {
    const data = await $.user.create({
      data: user,
    });

    await $.$disconnect();
    return data;
  }
}
