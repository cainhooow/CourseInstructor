import { PaymentProvider, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";

export default class PaymentProviderRepository extends Repository<
  PaymentProvider,
  Prisma.PaymentProviderInclude
> {
  public async index() {
    const includes = this.getIncludes();

    const data = await $.paymentProvider.findMany({
      include: includes,
    });

    return data as
      | Prisma.PaymentProviderGetPayload<{
          include: typeof includes;
        }>[]
      | null;
  }
}
