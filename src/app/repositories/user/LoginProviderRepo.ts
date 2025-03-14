import { $ } from "@/app/database";
import { LoginProvider, Prisma } from "@prisma/client";
import Repository from "../Repository";
import { LoginProviderDTO } from "@/app/dto/user/LoginProviderDTO";

type CreateableProvider = Omit<
  LoginProviderDTO,
  "id" | "created_at" | "updated_at"
>;

export default class LoginProviderRepository extends Repository<
  LoginProvider,
  Prisma.LoginProviderInclude
> {
  public async all(userId: string) {
    const includes = this.getIncludes();

    const data = await $.loginProvider.findMany({
      where: {
        userId,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.LoginProviderGetPayload<{
      include: typeof includes;
    }>[];
  }

  public async create(provider: CreateableProvider) {
    const data = await $.loginProvider.create({
      data: provider,
    });

    await $.$disconnect();
    return data;
  }
}
