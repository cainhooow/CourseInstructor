import { UserBillingDTO } from "@/app/dto/user/UserBilliingDTO";
import { Response } from "../Response";
import Cryptor from "@/app/utils/Cryptor";

export default class UserBillingResponse extends Response {
  constructor(protected data: UserBillingDTO | UserBillingDTO[]) {
    super();
  }

  protected makeData<_T>(data: UserBillingDTO) {
    return {
      id: data.id,
      name: data.name,
      document: new Cryptor().decrypt(data.document),
    };
  }
}
