import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";
import Logger from "../utils/Logger";

export default class LoggerMiddleware extends Middleware {
  constructor() {
    super();
  }

  handle(req: Request, _res: Response, next: NextFunction): void {
    Logger.request(req);
    next();
  }
}
