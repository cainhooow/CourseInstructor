import BillingRepo, {
  CreatableProfileBilling,
} from "@/app/repositories/user/BillingRepo";
import Cryptor from "@/app/utils/Cryptor";

export default class BillingService {
  constructor(protected repository = new BillingRepo()) {}

  public async create(billingProfile: CreatableProfileBilling, userId: string) {
    billingProfile.document = new Cryptor().encrypt(
      billingProfile.document
    ) as string;

    return await this.repository.create({
      ...billingProfile,
      User: {
        connect: { id: userId },
      },
    });
  }
}
