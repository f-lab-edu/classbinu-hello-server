import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {}
