import { UserBillingDTO } from "@/app/dto/user/user-billiing.dto";
import { Response } from "../response";
import Cryptor from "@/app/utils/cryptor";

export default class UserBillingResponse extends Response {
  constructor(protected readonly data: UserBillingDTO | UserBillingDTO[]) {
    super();
  }

  protected makeData<_T>(data: UserBillingDTO) {
    return {
      id: data.id,
      name: data.name,
      document: new Cryptor().decrypt(data.document),
      ...this.include,
    };
  }
}
