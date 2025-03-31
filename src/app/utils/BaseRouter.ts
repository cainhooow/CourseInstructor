import express from "express";
import Middleware from "../middleware/Middleware";
import Logger from "./Logger";

//#region
interface Options {
  prefix?: string;
  middlewares?: Middleware[];
}

interface RouterHandler {
  route(): void;
  getRouter(): express.Router;
}
//#endregion

//#region
export function Route(prefix: string) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        if (this.prefix !== undefined) {
          this.prefix = prefix;
        }
      }
    };
  };
}
export function Middlewares(middlewares: Middleware[]) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        this.middlewares = middlewares;
      }
    };
  };
}

function createRouteDecorator(method: string) {
  return function (path: string, middlewares: any[] = []) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ): PropertyDescriptor {
      if (!target.constructor.routes) {
        target.constructor.routes = [];
      }

      target.constructor.routes.push({
        method,
        path,
        middlewares,
        handler: propertyKey,
      });

      const originalMethod = descriptor.value;

      descriptor.value = async function (
        req: Request,
        res: Response,
        next: Function
      ) {
        for (const middleware of middlewares) {
          await middleware(req, res, next);
        }
        return originalMethod.apply(this, [req, res, next]);
      };
      return descriptor;
    };
  };
}

export const Get = createRouteDecorator("get");
export const Post = createRouteDecorator("post");
//#endregion

export default class BaseRouter implements RouterHandler {
  //#region
  protected router: express.Router;
  private prefix: string;
  private middlewares: Middleware[];
  private init: boolean = false;
  //#endregion
  
  constructor(options: Options = {}) {
    this.router = express.Router();
    this.prefix = options.prefix || "";
    this.middlewares = options.middlewares || [];
  }

  public route() {
    throw new Error("Method not implemented");
  }

  private registerRoutes() {
    const routes = (this.constructor as any).routes;
    if (!routes) return;

    for (const { method, path, middlewares, handler } of routes) {
      const handlerFunction = (this as any)[handler];

      if (middlewares.lenght > 0) {
        (this.router as any)[method](
          path,
          ...middlewares,
          handlerFunction.bind(this)
        );
      } else {
        (this.router as any)[method](path, handlerFunction.bind(this));
      }
    }
  }

  public getRouter(): express.Router {
    if (!this.init) {
      this.applyMiddlewares();
      this.registerRoutes();
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
      Logger.log("INFO", `Using middleware: ${middleware.constructor.name}`);
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
