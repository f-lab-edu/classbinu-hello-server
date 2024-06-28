import * as argon2 from 'argon2';

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthDto } from './dtos/auth.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { TokenStrategy } from './strategies/token.strategy';
import { RedisService } from 'src/redis/redis.service';
import { randomCodeGenerator } from './utils/random-code-generator';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private redisService: RedisService,
    @Inject('TokenStrategy') private tokenStrategy: TokenStrategy,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new ConflictException('Username already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.tokenStrategy.createTokens(
      newUser.id,
      newUser.username,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    const code = randomCodeGenerator();
    const setResult = await this.redisService.set(
      code,
      newUser.id.toString(),
      60 * 10,
    );

    if (setResult !== 'OK') {
      throw new Error('Failed to save code in Redis');
    }

    return tokens;
  }

  async verifyEmail(code: string) {
    const userId = await this.redisService.get(code);
    if (!userId) {
      throw new NotFoundException('Code not found');
    }
    await this.usersService.update(+userId, { isActive: true });
    const delResult = await this.redisService.del(code);
    if (delResult === 0) {
      throw new Error('Failed to delete code from Redis');
    }
    return { message: 'Email verified successfully' };
  }

  async login(authDto: AuthDto) {
    const user = await this.usersService.findByUsername(authDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(
      user.password,
      authDto.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.tokenStrategy.createTokens(
      user.id,
      user.username,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.tokenStrategy.createTokens(
      user.id,
      user.username,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
