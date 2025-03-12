import passport from "passport";
import { Strategy as PassportStrategy } from "passport-strategy";

interface IStrategy {
  register(): void;
}

export default abstract class Strategy implements IStrategy {
  protected abstract strategy: PassportStrategy;
  protected abstract name: string;

  public register(): void {
      passport.use(this.name, this.strategy);
  }
}
