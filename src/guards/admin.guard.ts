import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    // Todo: 권한 제어 하드코딩이 아닌 DB에서 가져오도록 수정
    const adminList = [1];

    if (!adminList.includes(userId)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
