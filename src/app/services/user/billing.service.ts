import BillingRepo, {
  CreatableProfileBilling,
} from "@/app/repositories/user/billing.repository";
import Cryptor from "@/app/utils/cryptor";
import AddressService from "./address.service";
import ResponseNotFound from "@/app/http/errors/not-found.error";
import ResponseUnauthorized from "@/app/http/errors/unauthorized.error";

export default class BillingService {
  constructor(
    protected readonly repository = new BillingRepo(),
    protected readonly addressService = new AddressService()
  ) {}

  public async create(billingProfile: CreatableProfileBilling) {
    const hasAddress = await this.addressService.findById(
      billingProfile.addressId
    );
    if (!hasAddress) {
      throw new ResponseNotFound(
        "User cannot have a address for assign to this billing profile"
      );
    }

    if (billingProfile.userId !== hasAddress.userId) {
      throw new ResponseUnauthorized(
        "The selected address does not belong to this user"
      );
    }

    billingProfile.document = new Cryptor().encrypt(
      billingProfile.document
    ) as string;

    return await this.repository.create({
      ...billingProfile,
    });
  }
}
