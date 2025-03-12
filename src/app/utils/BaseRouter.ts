import express from "express";
import Middleware from "../middleware/Middleware";

interface Options {
  prefix?: string;
  middlewares?: Middleware[];
}

interface RouterHandler {
  route(): void;
  getRouter(): express.Router;
}

export default class BaseRouter implements RouterHandler {
  protected router: express.Router;
  private prefix: string;
  private middlewares: Middleware[];
  private init: boolean = false;

  constructor(options: Options) {
    this.router = express.Router();
    this.prefix = options.prefix || "";
    this.middlewares = options.middlewares || [];
  }

  public route() {
    throw new Error("Method not implemented");
  }

  public getRouter(): express.Router {
    if (!this.init) {
      this.applyMiddlewares();
      this.route();
      this.applyErrorsMiddlewares();
      this.init = true;
    }

    if (this.prefix) {
      const prefixedRouter = express.Router();
      prefixedRouter.use(this.prefix, this.router);
      return prefixedRouter;
    }

    return this.router;
  }

  private applyMiddlewares() {
    this.middlewares.forEach((middleware) => {
      this.router.use(middleware.handle.bind(middleware));
    });
  }

  private applyErrorsMiddlewares() {
    this.middlewares.forEach((middleware) => {
      if (
        "handleError" in middleware &&
        Middleware.prototype.handleError !== middleware.handleError
      ) {
        this.router.use(middleware.handleError.bind(middleware));
      }
    });
  }
}
