import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";

export default class RoleMiddleware extends Middleware {
  constructor(protected allowedRoles: string[]) {
    super();
  }

  handle(_req: Request, _res: Response, next: NextFunction): void {
    next();
  }
}
