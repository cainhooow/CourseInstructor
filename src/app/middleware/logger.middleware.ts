import { Request, Response, NextFunction } from "express";
import Middleware from "./middleware";
import Logger from "../utils/logger";

export default class LoggerMiddleware extends Middleware {
  constructor() {
    super();
  }

  handle(req: Request, _res: Response, next: NextFunction): void {
    Logger.printRequest(req);
    next();
  }
}
