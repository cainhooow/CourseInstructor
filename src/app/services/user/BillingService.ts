import BillingRepo, {
  CreatableProfileBilling,
} from "@/app/repositories/user/BillingRepo";
import Cryptor from "@/app/utils/Cryptor";
import AddressService from "./AddressService";
import ResponseEmpty from "@/app/http/errors/ResponseEmpty";
import ResponseUnauthorized from "@/app/http/errors/ResponseUnauthorized";

export default class BillingService {
  constructor(
    protected repository = new BillingRepo(),
    protected addressService = new AddressService()
  ) {}

  public async create(billingProfile: CreatableProfileBilling) {
    const hasAddress = await this.addressService.findById(
      billingProfile.addressId
    );
    if (!hasAddress) {
      throw new ResponseEmpty(
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
