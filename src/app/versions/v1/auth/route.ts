import BaseRouter from "@/app/utils/BaseRouter";
import AuthLocalRouter from "./local/route";
export default class AuthRouter extends BaseRouter {
  constructor() {
    super({ prefix: "/auth" });
  }

  public route(): void {
    this.router.use(new AuthLocalRouter().getRouter());
  }
}
