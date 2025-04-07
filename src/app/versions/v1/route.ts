import Controller, { Route } from "@/app/utils/controller";
import AuthRouter from "./auth/route";
import MeRouter from "./@me/route";

@Route("/v1")
export default class V1Router extends Controller {
  constructor() {
    super();
  }

  public route(): void {
    this.router.use(new AuthRouter().getRouter());
    this.router.use(new MeRouter().getRouter());
  }
}
