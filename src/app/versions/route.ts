import ErrorMiddleware from "../middleware/ErrorMiddleware";
import LoggerMiddleware from "../middleware/LoggerMiddleware";
import BaseRouter from "../utils/BaseRouter";

export default class Router extends BaseRouter {
  constructor() {
    super({
      prefix: "/api",
      middlewares: [new ErrorMiddleware(), new LoggerMiddleware()],
    });
  }

  public route(): void {
    this.router.use("/");
  }
}
