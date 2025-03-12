import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";

export default class ErrorMiddleware extends Middleware {
  handleError(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });

    next(err);
  }
}
