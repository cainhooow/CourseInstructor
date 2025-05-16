import { Middlewares, Route } from "@fastexpress/http";
import { Controller } from "@fastexpress/http";
import CategoriesRouter from "./category/route";
import AuthMiddleware from "@/app/middleware/auth.middleware";
import RoleMiddleware from "@/app/middleware/role.middleware";
import FlagsRouter from "./flags/route";
import PlatformRouter from "./platform/route";

@Route("/system")
@Middlewares([
  new AuthMiddleware("jwt"),
  new RoleMiddleware(["CAN_LIST_SERVER_SETTINGS"]),
])
export default class SystemRouter extends Controller {
  constructor() {
    super();
  }

  public route(): void {
    this.router.use(new PlatformRouter().getRouter());
    this.router.use(new CategoriesRouter().getRouter());
    this.router.use(new FlagsRouter().getRouter());
  }
}
