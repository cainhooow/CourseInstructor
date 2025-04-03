import { Address, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";

export type CreatableAddress = Prisma.AddressCreateInput;

export default class AddressRepo extends Repository<
  Address,
  Prisma.AddressInclude
> {
  public async findById(id: string) {
    const includes = this.getIncludes();

    const data = await $.address.findFirst({
      where: {
        id,
      },
      include: includes,
    });

    await $.$disconnect();

    return data as Prisma.AddressGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async findByUserId(userId: string) {
    const includes = this.getIncludes();

    const data = await $.address.findFirst({
      where: {
        User: {
          id: userId,
        },
      },
      include: includes,
    });

    await $.$disconnect();

    return data as Prisma.AddressGetPayload<{
      include: typeof includes;
    }> | null;
  }

  public async create(address: CreatableAddress) {
    const data = await $.address.create({
      data: {
        ...address,
      },
    });

    await $.$disconnect();

    return data;
  }
}
