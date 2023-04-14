import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuardAdmin extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    console.log(result);

    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
