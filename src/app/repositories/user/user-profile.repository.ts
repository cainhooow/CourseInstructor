import { $ } from "@/app/database";
import { UserProfileDTO } from "@/app/dto/user/user-profile.dto";
import { Prisma, Profile, ProfileType } from "@prisma/client";
import Repository from "../repository";

export type CreatableProfile = Omit<
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
    return data as Prisma.ProfileGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async findByUserId(id: string) {
    const includes = this.getIncludes();

    const data = await $.profile.findFirst({
      where: {
        userId: id,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.ProfileGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async setBio(id: string, bio: string) {
    const includes = this.getIncludes();

    const data = await $.profile.update({
      where: {
        id,
      },
      data: {
        bio,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.ProfileGetPayload<{
      include: typeof includes;
    }>;
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
    return data as Prisma.ProfileGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async update(
    profileId: string,
    userId: string,
    user: CreatableProfile
  ) {
    const includes = this.getIncludes();

    const data = await $.profile.update({
      where: {
        id: profileId,
        User: {
          id: userId,
        },
      },
      data: { ...user },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.ProfileGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async create(profile: CreatableProfile) {
    const data = await $.profile.create({
      data: profile,
    });

    await $.$disconnect();
    return data;
  }
}
