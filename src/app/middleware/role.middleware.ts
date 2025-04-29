import { Request, Response, NextFunction } from "express";
import Middleware from "./middleware";
import { UserWithFlagsDTO } from "../dto/user/user.dto";
import { FlagsType } from "@prisma/client";
import ResponseUnauthorized from "../http/errors/unauthorized.error";

export default class RoleMiddleware extends Middleware {
  constructor(protected allowedRoles: FlagsType[]) {
    super();
  }

  handle(req: Request, _res: Response, _next: NextFunction): void {
    const user = req.user as UserWithFlagsDTO;
    const roles = user.Flags.map((role) => role.name);

    this.allowedRoles.map((role) => {
      if (!roles.includes(role)) {
        throw new ResponseUnauthorized("The user does not have permission to perform this operation")
      }
    });
  }
}
