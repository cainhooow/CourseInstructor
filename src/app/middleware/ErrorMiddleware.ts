import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";
import { BaseError } from "../http/errors/BaseError";
import { ValidationError } from "../http/errors/ValidationError";

export default class ErrorMiddleware extends Middleware {
  handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.log(err)
    if (err instanceof ValidationError) {
      res.status(400).json({
        message: req.t(err.message),
        errors: err.errors,
      });

      return;
    }

    if (err instanceof BaseError) {
      res.status(err.code).json({
        message: req.t(err.message),
      });

      return;
    }

    res.status(500).json({
      message: req.t("errors.internal_server_error"),
      err: err.message,
    });

    next(err);
  }
}
