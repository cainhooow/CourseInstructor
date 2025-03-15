import RefreshTokenRepository from "@/app/repositories/user/RefreshTokenRepo";
import JwtService from "../JwtService";

export default class AuthService {
  private SECRET = process.env.AUTH_SERVICE_SECRET as string;

  constructor(
    protected repository = new RefreshTokenRepository(),
    protected jwtService = new JwtService()
  ) {}

  public async create(userId: string) {
    const newRefreshToken = {
      id: new Bun.CryptoHasher("sha256", this.SECRET).digest("hex"),
      userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };

    const refreshToken = this.jwtService.sign(
      {
        id: newRefreshToken.userId,
      },
      "1h"
    );

    const token = this.jwtService.sign(
      {
        id: newRefreshToken.id,
      },
      "7d"
    );
    await this.repository.create({
      ...newRefreshToken,
    });

    return {
      refreshToken,
      token,
    };
  }

  public async renew(token: string) {
    const payload = this.jwtService.verify(token) as { id: string };
    if (!payload || !payload.id) {
      throw new Error("Invalid token");
    }

    const existsToken = await this.repository.findById(payload.id);
    if (!existsToken || existsToken.expires_at < new Date()) {
      throw new Error("RefreshToken expired! Please, try to login again");
    }

    await this.repository.delete(existsToken.id);
    const newToken = await this.create(existsToken.userId);

    return newToken;
  }

  public async login(userId: string) {
    const existsToken = await this.repository.findByUserId(userId);
    if (existsToken) {
      await this.repository.delete(existsToken.id);
    }

    return this.create(userId);
  }
}
