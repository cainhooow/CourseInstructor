import { Route, Controller } from "@fastexpress/http";
import PlatformPaymentRouter from "./payments/route";

@Route("/settings")
export default class PlatformSettingsRouter extends Controller {
  constructor() {
    super();
  }

  async index() {}

  public route(): void {
    this.router.use(new PlatformPaymentRouter().getRouter());
  }
}
