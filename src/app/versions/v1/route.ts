import BaseRouter, { Route } from "@/app/utils/base-router";
import AuthRouter from "./auth/route";
import MeRouter from "./@me/route";

@Route("/v1")
export default class V1Router extends BaseRouter {
  constructor() {
    super();
  }

  public route(): void {
    this.router.use(new AuthRouter().getRouter());
    this.router.use(new MeRouter().getRouter());
  }
}
