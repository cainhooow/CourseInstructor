import AddressRepo, {
  CreatableAddress,
} from "@/app/repositories/user/AddressRepo";
import Cryptor from "@/app/utils/Cryptor";

export default class AddressService {
  constructor(protected repository = new AddressRepo()) {}

  public async findById(id: string) {
    return await this.repository.findById(id);
  }

  public async findByUserId(userId: string) {
    return await this.repository.findByUserId(userId);
  }

  public async create(address: CreatableAddress) {
    const cryptor = new Cryptor();
    address.address = cryptor.encrypt(address.address) as string;
    address.city = cryptor.encrypt(address.city) as string;
    address.street = cryptor.encrypt(address.street) as string;

    return await this.repository.create(address);
  }
}
