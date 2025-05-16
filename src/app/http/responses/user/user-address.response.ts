import { UserAddressDTO } from "@/app/dto/user/user-address.dto";
import { Response } from "../response";
import Cryptor from "@/app/utils/cryptor";

export default class UserAddressResponse extends Response {
  constructor(protected readonly data: UserAddressDTO | UserAddressDTO[]) {
    super(data);
  }

  protected makeData<_T>(data: UserAddressDTO) {
    const cryptor = new Cryptor();

    return {
      id: data.id,
      country: data.country,
      city: cryptor.decrypt(data.city),
      state: data.state,
      street: cryptor.decrypt(data.street),
      address: cryptor.decrypt(data.address),
      ...this.include,
    };
  }
}
