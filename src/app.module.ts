import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { FilesController } from './files.controller';
import { LastActivityInterceptor } from './interceptors/last-activity.interceptor';
import { PublicationsModule } from './publications/publications.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationsModule,
    PublicationsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, FilesController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LastActivityInterceptor,
    },
  ],
})
export class AppModule {}
