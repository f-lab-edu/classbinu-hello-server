import * as argon2 from 'argon2';

import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthDto } from './dtos/auth.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
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
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(auth: AuthDto) {
    const user = await this.usersService.findByUsername(auth.username);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await argon2.verify(user.password, auth.password);
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }
    const tokens = await this.getTokens(user.id, user.username);
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

  async getTokens(userId: number, username: string) {
    const accessToken = await this.createToken(
      userId,
      username,
      'jwt.accessSecret',
      '15m',
    );
    const refreshToken = await this.createToken(
      userId,
      username,
      'jwt.refreshSecret',
      '7d',
    );

    return { accessToken, refreshToken };
  }

  async createToken(
    userId: number,
    username: string,
    secretKey: string,
    expiresIn: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.configService.get(secretKey),
        expiresIn,
      },
    );
  }
}