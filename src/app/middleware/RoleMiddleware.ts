import { Request, Response, NextFunction } from "express";
import Middleware from "./Middleware";
import { UserWithFlagsDTO } from "../dto/user/UserDTO";
import { FlagsType } from "@prisma/client";
import ResponseUnauthorized from "../http/errors/ResponseUnauthorized";

export default class RoleMiddleware extends Middleware {
  constructor(protected allowedRoles: FlagsType[]) {
    super();
  }

  handle(req: Request, _res: Response, next: NextFunction): void {
    const user = req.user as UserWithFlagsDTO;

    user.Flags.map((role) => {
      if (!this.allowedRoles.includes(role.name)) {
        throw new ResponseUnauthorized(
          "The user does not have permissions for this operation"
        );
      }
    });

    next();
  }
}
