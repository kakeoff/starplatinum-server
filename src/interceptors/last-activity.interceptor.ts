import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/types';

@Injectable()
export class LastActivityInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        const user: UserInfo = request.user;
        if (user) {
          try {
            await this.prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                lastVisitDate: new Date(),
              },
            });
          } catch (error) {
            // Обработка ошибок
            console.error('Error updating user last visit date:', error);
          }
        }
      }),
    );
  }
}
