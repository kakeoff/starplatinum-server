import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await context.switchToHttp().getRequest();
    const user = request.user.user;
    console.log('DFSFSDFSDFSDFSD', user);
    if (user && user.role === 0) {
      throw new ForbiddenException('no access');
    }

    return true;
  }
}
