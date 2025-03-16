import BaseRouter from "@/app/utils/BaseRouter";
import AuthRouter from "./auth/route";
import MeRouter from "./@me/route";

export default class V1Router extends BaseRouter {
  constructor() {
    super({
      prefix: "/v1",
    });
  }

  public route(): void {
    this.router.use(new AuthRouter().getRouter());
    this.router.use(new MeRouter().getRouter());
  }
}
