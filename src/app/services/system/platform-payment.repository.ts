import PlatformPaymentRepository from "@/app/repositories/system/platform-payment.repository";

export default class PlatformPaymentService {
  constructor(
    protected readonly repository = new PlatformPaymentRepository()
  ) {}

  public async index() {
    return await this.repository.index();
  }
}
