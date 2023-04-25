import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}
  async getAllApplications() {
    const applications = await this.prisma.application.findMany({
      select: {
        id: true,
        name: true,
        comment: true,
        email: true,
        pubs: true,
        cost: true,
        status: true,
      },
    });
    return applications;
  }
  async sendApplication(application) {
    const app = await this.prisma.application.create({
      data: {
        name: application.name,
        comment: application.comment,
        email: application.email,
        pubs: application.pubs,
        cost: application.cost,
        status: ApplicationStatus.PENDING,
      },
    });
    return app;
  }

  async deleteApplication(applicationId: number) {
    await this.prisma.application.delete({
      where: {
        id: Number(applicationId),
      },
    });
  }
}
