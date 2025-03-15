import ErrorMiddleware from "../middleware/ErrorMiddleware";
import LoggerMiddleware from "../middleware/LoggerMiddleware";
import BaseRouter from "../utils/BaseRouter";
import V1Router from "./v1/route";

export default class Router extends BaseRouter {
  constructor() {
    super({
      prefix: "/api",
      middlewares: [new ErrorMiddleware(), new LoggerMiddleware()],
    });
  }

  public route(): void {
    this.router.use(new V1Router().getRouter());
  }
}
