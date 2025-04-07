import ErrorMiddleware from "../middleware/error.middleware";
import LoggerMiddleware from "../middleware/logger.middleware";
import Controller, { Middlewares, Route } from "../utils/controller";
import V1Router from "./v1/route";

@Route("/api")
@Middlewares([new ErrorMiddleware(), new LoggerMiddleware()])
export default class Router extends Controller {
  constructor() {
    super();
  }

  public route(): void {
    this.router.use(new V1Router().getRouter());
  }
}
