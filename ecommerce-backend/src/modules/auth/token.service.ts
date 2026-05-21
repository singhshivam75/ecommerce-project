import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    const accessOptions: JwtSignOptions = {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: process.env.JWT_ACCESS_EXPIRY as any,
    };

    const refreshOptions: JwtSignOptions = {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: process.env.JWT_REFRESH_EXPIRY as any,
    };

    const accessToken = await this.jwtService.signAsync(payload, accessOptions);
    const refreshToken = await this.jwtService.signAsync(payload, refreshOptions);

    return {
      accessToken,
      refreshToken,
    };
  }
}