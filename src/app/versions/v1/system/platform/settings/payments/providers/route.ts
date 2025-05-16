import { PaymentProviderDTO } from "@/app/dto/system/payment-provider.dto";
import { Request, Response } from "express";
import { Route, Controller, Get } from "@fastexpress/http";
import PaymentProviderService from "@/app/services/system/payment-provider.reposity";
import PaymentProviderResponse from "@/app/http/responses/system/payment-provider.response";
import Guard from "@/app/utils/type-guards";

@Route("/providers")
export default class PaymentProviderRouter extends Controller {
  constructor(protected readonly service = new PaymentProviderService()) {
    super();
  }

  @Get("/")
  async index(_req: Request, res: Response) {
    const data = await this.service.index();
    return res.json(
      new PaymentProviderResponse(Guard.assumeAs<PaymentProviderDTO[]>(data))
    );
  }

  public route(): void {}
}
