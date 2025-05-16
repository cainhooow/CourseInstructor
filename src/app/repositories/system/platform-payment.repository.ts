import { PlatformPayment, Prisma } from "@prisma/client";
import Repository from "../repository";
import { $ } from "@/app/database";

export default class PlatformPaymentRepository extends Repository<
  PlatformPayment,
  Prisma.PlatformPaymentInclude
> {
  public async index() {
    const includes = this.getIncludes();

    const data = await $.platformPayment.findMany({
      include: includes,
    });

    return data as
      | Prisma.PlatformPaymentGetPayload<{
          include: typeof includes;
        }>[]
      | null;
  }
}
