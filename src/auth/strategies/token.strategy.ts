import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface TokenStrategy {
  createTokens(userId: number, username: string);
}

@Injectable()
abstract class BaseTokenStrategy implements TokenStrategy {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    protected jwtService: JwtService,
    protected configService: ConfigService,
  ) {
    this.accessSecret = this.configService.get('jwt.accessSecret');
    this.refreshSecret = this.configService.get('jwt.refreshSecret');
    this.accessExpiresIn = this.configService.get('jwt.accessExpiresIn');
    this.refreshExpiresIn = this.configService.get('jwt.refreshExpiresIn');
  }

  async createTokens(userId: number, username: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.refreshSecret,
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
