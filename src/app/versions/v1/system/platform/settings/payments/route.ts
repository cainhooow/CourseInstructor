import { Request, Response } from "express";
import { Route, Controller, Get } from "@fastexpress/http";
import PaymentProviderRouter from "./providers/route";
import PlatformPaymentService from "@/app/services/system/platform-payment.repository";
import PlatformPaymentResponse from "@/app/http/responses/system/platform-payment.response";
import Guard from "@/app/utils/type-guards";
import { PlatformPaymentDTO } from "@/app/dto/system/platform-payment.dto";

@Route("/payments")
export default class PlatformPaymentRouter extends Controller {
  constructor(protected readonly service = new PlatformPaymentService()) {
    super();
  }

  @Get("/")
  async index(_req: Request, res: Response) {
    const data = await this.service.index();
    return res.json(
      new PlatformPaymentResponse(Guard.assumeAs<PlatformPaymentDTO[]>(data))
    );
  }

  public route(): void {
    this.router.use(new PaymentProviderRouter().getRouter());
  }
}
