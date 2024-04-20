import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { UserInfo, UserRole } from 'src/types';
import { PrismaService } from '../prisma/prisma.service';
import { SendApplicationDto } from './applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}
  async getAllApplications() {
    const applications = await this.prisma.application.findMany({
      include: {
        ApplicationPublications: {
          select: {
            id: true,
            publicationId: true,
            publicationDate: true,
          },
        },
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    const flattenedApplications = applications.map(async (app) => {
      const pubs = await Promise.all(
        app.ApplicationPublications.map(async (appPub) => {
          const modelPub = await this.prisma.publication.findUnique({
            where: { id: appPub.publicationId },
          });
          return modelPub && modelPub.id === appPub.publicationId
            ? {
                id: appPub.id,
                name: modelPub.name,
                date: appPub.publicationDate,
              }
            : null;
        }),
      );

      return {
        id: app.id,
        name: app.name,
        comment: app.comment,
        email: app.email,
        cost: app.cost,
        status: app.status,
        pubs: pubs.filter(Boolean),
        userId: app.User.id,
        createdAt: app.createdAt,
      };
    });

    return Promise.all(flattenedApplications);
  }

  async getUserApplications(userId: number) {
    const applications = await this.prisma.application.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        ApplicationPublications: {
          select: {
            id: true,
            publicationId: true,
            publicationDate: true,
          },
        },
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    const flattenedApplications = applications.map(async (app) => {
      const pubs = await Promise.all(
        app.ApplicationPublications.map(async (appPub) => {
          const modelPub = await this.prisma.publication.findUnique({
            where: { id: appPub.publicationId },
          });
          return modelPub && modelPub.id === appPub.publicationId
            ? {
                id: appPub.id,
                name: modelPub.name,
                date: appPub.publicationDate,
              }
            : null;
        }),
      );

      return {
        id: app.id,
        name: app.name,
        comment: app.comment,
        email: app.email,
        cost: app.cost,
        status: app.status,
        pubs: pubs.filter(Boolean),
        userId: app.User.id,
        createdAt: app.createdAt,
      };
    });

    return Promise.all(flattenedApplications);
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
  async deleteMyApplication(user: UserInfo, applicationId: number) {
    if (user.role === UserRole.user) {
      const application = await this.prisma.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          User: true,
        },
      });
      if (user.id !== application.User.id) {
        throw new ForbiddenException('no access');
      }
    }

    await this.prisma.application.delete({
      where: {
        id: Number(applicationId),
      },
    });
  }
}
