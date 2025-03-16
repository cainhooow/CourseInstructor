import jwt from "jsonwebtoken";
import ms from "ms";

export default class JwtService {
  private SECRET = process.env.JWT_SECRET as string;

  public sign(payload: any, expiresIn?: ms.StringValue) {
    return jwt.sign(payload, this.SECRET, {
      expiresIn,
    });
  }

  public verify(token: string) {
    return jwt.verify(token, this.SECRET);
  }
}
