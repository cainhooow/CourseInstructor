import { Strategy as PassportLocal } from "passport-local";
import Strategy from "./Strategy";
import UserService from "../services/user/UserService";
import PasswordService from "../services/user/PasswordService";

export default class LocalStrategy extends Strategy {
  protected name = "local";
  protected strategy: PassportLocal;

  constructor(
    protected service = new UserService(),
    protected passwordService = new PasswordService()
  ) {
    super();

    this.strategy = new PassportLocal(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (_req, username, password, done) {
        const user = await service.findByEmail(username);
        if (!user) {
          return done({ message: "Invalid username or password" }, false);
        }

        const userPassword = await passwordService.onlyActive(user.id);
        if (!userPassword) {
          return done({ message: "No active passwords" }, false);
        }

        if (!service.verifyPassoword(password, userPassword.password)) {
          return done({ message: "Invalid username or password" }, false);
        }

        return done(null, user);
      }
    );

    this.register();
  }
}
