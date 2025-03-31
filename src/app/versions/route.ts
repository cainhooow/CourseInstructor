import ErrorMiddleware from "../middleware/ErrorMiddleware";
import LoggerMiddleware from "../middleware/LoggerMiddleware";
import BaseRouter, { Middlewares, Route } from "../utils/BaseRouter";
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
