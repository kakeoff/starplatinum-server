import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { UserInfo } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';
import { SendApplicationDto } from './applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}
  async getAllApplications() {
    const applications = await this.prisma.application.findMany({
      include: {
        ApplicationPublications: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });
    const flattenedApplications = [];
    for (const app of applications) {
      const resultPubsfilter = [];
      for (const appPub of app.ApplicationPublications) {
        const modelPub = await this.prisma.publication.findUnique({
          where: {
            id: appPub.publicationId,
          },
        });
        if (modelPub && modelPub.id === appPub.publicationId) {
          const data = {
            id: appPub.id,
            name: modelPub.name,
            date: appPub.publicationDate,
          };
          resultPubsfilter.push(data);
        }
      }
      flattenedApplications.push({
        id: app.id,
        name: app.name,
        comment: app.comment,
        email: app.email,
        cost: app.cost,
        status: app.status,
        pubs: resultPubsfilter,
        userId: app.User.id,
        createdAt: app.createdAt,
      });
    }
    return flattenedApplications;
  }

  async sendApplication(application: SendApplicationDto, user: UserInfo) {
    if (!user && !user.id) {
      throw new ForbiddenException('user not found');
    }
    const app = await this.prisma.application.create({
      data: {
        name: application.name,
        comment: application.comment,
        email: application.email,
        cost: application.cost,
        status: ApplicationStatus.PENDING,
        userId: user.id,
      },
    });
    const promises = [];
    application.pubs.forEach((pub) => {
      promises.push(
        this.prisma.applicationPublications.create({
          data: {
            applicationId: app.id,
            publicationId: pub.id,
            publicationDate: pub.date,
          },
        }),
      );
    });
    await Promise.all(promises);

    const flattenedApp = {
      id: app.id,
      name: app.name,
      comment: app.comment,
      email: app.email,
      status: app.status,
      cost: app.cost,
      pubs: application.pubs,
      userId: user.id,
    };
    return flattenedApp;
  }
  async changeApplicationStatus(id: number, status: ApplicationStatus) {
    const app = await this.prisma.application.update({
      where: {
        id: id,
      },
      data: {
        status: ApplicationStatus[status],
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
