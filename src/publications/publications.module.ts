import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PrismaService],
})
export class PublicationsModule {}
