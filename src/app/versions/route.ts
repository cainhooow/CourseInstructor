import ErrorMiddleware from "../middleware/error.middleware";
import LoggerMiddleware from "../middleware/logger.middleware";
import BaseRouter, { Middlewares, Route } from "../utils/base-router";
import V1Router from "./v1/route";

@Route("/api")
@Middlewares([new ErrorMiddleware(), new LoggerMiddleware()])
export default class Router extends BaseRouter {
  constructor() {
    super();
  }

  public route(): void {
    this.router.use(new V1Router().getRouter());
  }
}
