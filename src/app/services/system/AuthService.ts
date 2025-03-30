import RefreshTokenRepository from "@/app/repositories/user/RefreshTokenRepo";
import JwtService from "./JwtService";
import Cryptor from "@/app/utils/Cryptor";

export default class AuthService {
  constructor(
    protected repository = new RefreshTokenRepository(),
    protected jwtService = new JwtService()
  ) {}

  public async create(userId: string) {
    const newRefreshToken = {
      id: new Cryptor().random(),
      userId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };

    console.log(newRefreshToken)

    const accessToken = this.jwtService.sign(
      {
        id: newRefreshToken.userId,
      },
      "1h"
    );

    const refreshToken = this.jwtService.sign(
      {
        id: newRefreshToken.id,
      },
      "7d"
    );
    
    await this.repository.create({
      ...newRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
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
