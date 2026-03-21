import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPort } from '../../application/ports/token.port';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAdapter implements TokenPort {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow('AUTH.JWT_ACCESS_SECRET'),
      expiresIn: '10m',
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow('AUTH.JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  async generateRefreshTokenWithExpiration(
    payload: Record<string, any>,
    expiresInMs: number,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow('AUTH.JWT_REFRESH_SECRET'),
      expiresIn: Math.floor(expiresInMs / 1000),
    });
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<{ sub: string; name: string; email: string; sessionId: string }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.getOrThrow('AUTH.JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
