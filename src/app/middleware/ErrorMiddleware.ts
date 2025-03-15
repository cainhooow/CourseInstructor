import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";
import { ValidationError } from "../http/requests/Request";

export default class ErrorMiddleware extends Middleware {
  handleError(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof ValidationError) {
      res.status(400).json({
        message: err.message,
        errors: err.errors,
      });

      return;
    }

    res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });

    next(err);
  }
}
