import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface TokenStrategy {
  createTokens(userId: number, username: string);
}

@Injectable()
abstract class BaseTokenStrategy implements TokenStrategy {
  constructor(
    protected jwtService: JwtService,
    protected configService: ConfigService,
  ) {}

  async createTokens(userId: number, username: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.getRefreshTokenExpiresIn(),
      },
    );

    return { accessToken, refreshToken };
  }

  protected abstract getRefreshTokenExpiresIn(): string;
}

@Injectable()
export class LocalTokenStrategy extends BaseTokenStrategy {
  protected getRefreshTokenExpiresIn() {
    return '7d';
  }
}

@Injectable()
export class DevTokenStrategy extends BaseTokenStrategy {
  protected getRefreshTokenExpiresIn() {
    return '9999d';
  }
}
