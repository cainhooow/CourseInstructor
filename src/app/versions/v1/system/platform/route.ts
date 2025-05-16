import { Route, Controller } from "@fastexpress/http";
import PlatformSettingsRouter from "./settings/route";

@Route("/platform")
export default class PlatformRouter extends Controller {
  constructor() {
    super();
  }

  public route(): void {
    this.router.use(new PlatformSettingsRouter().getRouter());
  }
}
