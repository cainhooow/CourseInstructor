import { $ } from "@/app/database";
import { UserProfileDTO } from "@/app/dto/user/UserProfileDTO";
import { Prisma, Profile, ProfileType } from "@prisma/client";
import Repository from "../Repository";

type CreatableProfile = Omit<
  UserProfileDTO,
  "id" | "created_at" | "updated_at"
>;

export default class UserProfileRepository extends Repository<
  Profile,
  Prisma.ProfileInclude
> {
  public async findById(id: string) {
    const includes = this.getIncludes();

    const data = await $.profile.findUnique({
      where: {
        id,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.ProfileGetPayload<{ include: typeof includes }>;
  }

  public async setType(id: string, type: ProfileType) {
    const includes = this.getIncludes();

    const data = await $.profile.update({
      where: {
        id,
      },
      data: {
        type,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.ProfileGetPayload<{ include: typeof includes }>;
  }

  public async create(profile: CreatableProfile) {
    const data = await $.profile.create({
      data: profile,
    });

    await $.$disconnect();
    return data;
  }
}
