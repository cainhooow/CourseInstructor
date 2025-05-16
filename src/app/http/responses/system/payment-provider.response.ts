import { PaymentProviderDTO } from "@/app/dto/system/payment-provider.dto";
import { Response } from "../response";

export default class PaymentProviderResponse extends Response {
  constructor(
    protected readonly data: PaymentProviderDTO | PaymentProviderDTO[]
  ) {
    super(data);
  }

  protected makeData<_T>(data: PaymentProviderDTO) {
    return {
      id: data.id,
      name: data.name,
      accessKey: data.accessKey,
      ...this.include,
    };
  }
}
