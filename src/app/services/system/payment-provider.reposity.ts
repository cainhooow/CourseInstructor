import PaymentProviderRepository from "@/app/repositories/system/payment-provider.repository";

export default class PaymentProviderService {
  constructor(
    protected readonly repository = new PaymentProviderRepository()
  ) {}

  public async index() {
    return await this.repository.index();
  }
}
