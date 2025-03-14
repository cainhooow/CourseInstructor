import { Strategy as PassportLocal } from "passport-local";
import Strategy from "./Strategy";

export default class LocalStrategy extends Strategy {
  protected name = "local";
  protected strategy: PassportLocal;

  constructor() {
    super();

    this.strategy = new PassportLocal(
      {
        passReqToCallback: true,
      },
      async function (req, username, password, done) {
        done(null, { username, password });
      }
    );

    this.register();
  }
}
