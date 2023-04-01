import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationsController } from './applications.controler';
import { ApplicationsService } from './applications.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaService],
})
export class ApplicationsModule {}
