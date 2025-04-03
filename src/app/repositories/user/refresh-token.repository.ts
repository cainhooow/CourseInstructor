import { Prisma, RefreshToken } from "@prisma/client";
import Repository from "../repository";
import { RefreshTokenDTO } from "@/app/dto/user/refresh-token.dto";
import { $ } from "@/app/database";

export type CreatableRefreshToken = Omit<
  RefreshTokenDTO,
  "created_at" | "updated_at"
>;

export default class RefreshTokenRepository extends Repository<
  RefreshToken,
  Prisma.RefreshTokenInclude
> {
  public async findById(id: string) {
    const includes = this.getIncludes();
    const data = await $.refreshToken.findUnique({
      where: {
        id,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.RefreshTokenGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async findByUserId(userId: string) {
    const includes = this.getIncludes();
    const data = await $.refreshToken.findFirst({
      where: {
        userId,
      },
      include: includes,
    });

    await $.$disconnect();
    return data as Prisma.RefreshTokenGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async create(refreshToken: CreatableRefreshToken) {
    const data = await $.refreshToken.create({
      data: refreshToken,
    });

    await $.$disconnect();
    return data;
  }

  public async delete(tokenId: string) {
    const data = await $.refreshToken.delete({
      where: {
        id: tokenId,
      },
    });

    await $.$disconnect();
    return !data;
  }
}
