import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Request } from 'express';
import { AuthDto } from './dtos/auth.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JWT_CLAIMS } from './constants/auth.constatns';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() auth: AuthDto) {
    return this.authService.login(auth);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user[JWT_CLAIMS.SUB]);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const userId = req.user[JWT_CLAIMS.SUB];
    const refreshToken = req.user[JWT_CLAIMS.REFRESH_TOKEN];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
