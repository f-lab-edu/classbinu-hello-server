import {
  DevTokenStrategy,
  LocalTokenStrategy,
} from './strategies/token.strategy';

import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/redis/redis.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PassportModule, RedisModule, JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: 'TokenStrategy',
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevTokenStrategy
          : LocalTokenStrategy,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
