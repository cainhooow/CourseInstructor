import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";
import passport from "passport";
import { UserDTO } from "../dto/user/UserDTO";

export default class AuthMiddleware extends Middleware {
  constructor(private strategy: string) {
    super();
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate(
      this.strategy,
      { session: false },
      (err: any, user: UserDTO, info: any) => {
        if (err || !user) {
          return res.status(400).json({
            message: info ? info.message : "Login failed",
          });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  }
}
