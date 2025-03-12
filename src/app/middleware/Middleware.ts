import { Request, Response, NextFunction } from "express";

interface IMiddleware {
  handle(req: Request, res: Response, next: NextFunction): void;
}

interface IErrorMiddleware {
  handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

export default abstract class Middleware
  implements IMiddleware, IErrorMiddleware
{
  handle(_req: Request, _res: Response, next: NextFunction): void {
    next();
  }

  handleError(
    err: Error,
    _req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    next(err);
  }
}
