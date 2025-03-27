import { $ } from "@/app/database";
import { BillingInfo, Prisma } from "@prisma/client";
import Repository from "../Repository";

export type CreatableProfileBilling = Prisma.BillingInfoCreateInput;

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
