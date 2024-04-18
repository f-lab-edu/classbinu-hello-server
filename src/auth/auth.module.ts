import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}