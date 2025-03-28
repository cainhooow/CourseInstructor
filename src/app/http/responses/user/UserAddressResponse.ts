import { UserAddressDTO } from "@/app/dto/user/UserAddressDTO";
import { Response } from "../Response";
import Cryptor from "@/app/utils/Cryptor";

export default class UserAddressResponse extends Response {
  constructor(protected data: UserAddressDTO | UserAddressDTO[]) {
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
    };
  }
}
