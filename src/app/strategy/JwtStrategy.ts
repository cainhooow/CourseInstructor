import Strategy from "./Strategy";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Request } from "express";
import UserService from "../services/user/UserService";

export default class JwtAuthStrategy extends Strategy {
  protected name = "jwt";
  protected strategy: JwtStrategy;

  constructor(protected service = new UserService()) {
    super();

    this.strategy = new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET as string,
        passReqToCallback: true,
      },
      async (_req: Request, payload, done) => {
        if (!payload) {
          return done(null, false);
        }

        const user = await this.service.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        
        return done(null, user);
      }
    );
    this.register();
  }
}
