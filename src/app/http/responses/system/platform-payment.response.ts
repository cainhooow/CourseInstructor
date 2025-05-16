import { PlatformPaymentDTO } from "@/app/dto/system/platform-payment.dto";
import { Response } from "../response";

export default class PlatformPaymentResponse extends Response {
  constructor(
    protected readonly data: PlatformPaymentDTO | PlatformPaymentDTO[]
  ) {
    super(data);
  }

  protected makeData<_T>(data: PlatformPaymentDTO) {
    return {
      id: data.id,
      active: data.active,
      providerId: data.paymentProviderId,
    };
  }
}
