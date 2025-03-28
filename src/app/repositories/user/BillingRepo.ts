import { $ } from "@/app/database";
import { BillingInfo, Prisma } from "@prisma/client";
import Repository from "../Repository";
import { UserBillingDTO } from "@/app/dto/user/UserBilliingDTO";

export type CreatableProfileBilling = Omit<
  UserBillingDTO,
  "id" | "created_at" | "updated_at"
>;

export default class BillingRepo extends Repository<
  BillingInfo,
  Prisma.BillingInfoInclude
> {
  public async create(billingInfo: CreatableProfileBilling) {
    const data = await $.billingInfo.create({
      data: billingInfo,
    });

    await $.$disconnect();
    return data;
  }
}
