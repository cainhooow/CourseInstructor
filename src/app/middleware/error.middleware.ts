import { Request, Response, NextFunction } from "express";
import Middleware from "./middleware";
import { BaseError } from "../http/errors/base.error";
import ValidationError from "../http/errors/validation.error";
import Logger from "../utils/logger";

export default class ErrorMiddleware extends Middleware {
  handleError(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    if (err instanceof ValidationError) {
      Logger.error("Validation error:", err.message, (err as any).errors);
      res.status(400).json({
        message: req.t(err.message),
        errors: err.errors,
      });

      return;
    }

    if (err instanceof BaseError) {
      Logger.error("Error:", err.message);
      res.status(err.code).json({
        message: req.t(err.message),
      });

      return;
    }

    Logger.error("Internal Error:", err.message);
    res.status(500).json({
      message: req.t("errors.internal_server_error"),
      err: err.message,
    });

    _next();
  }
}
