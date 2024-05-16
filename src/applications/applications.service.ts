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
        applicationPublications: {
          select: {
            id: true,
            publicationId: true,
            publicationDate: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const flattenedApplications = applications.map(async (app) => {
      return {
        id: app.id,
        comment: app.comment,
        responsibleId: app.responsibleId,
        cost: app.cost,
        status: app.status,
        pubs: app.applicationPublications.map((pub) => {
          return {
            id: pub.publicationId,
            date: pub.publicationDate,
          };
        }),
        userId: app.user.id,
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
        applicationPublications: {
          select: {
            id: true,
            publicationId: true,
            publicationDate: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const flattenedApplications = applications.map(async (app) => {
      return {
        id: app.id,
        comment: app.comment,
        responsibleId: app.responsibleId,
        cost: app.cost,
        status: app.status,
        pubs: app.applicationPublications.map((pub) => {
          return {
            id: pub.publicationId,
            date: pub.publicationDate,
          };
        }),
        userId: app.user.id,
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
        comment: application.comment,
        cost: application.cost,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
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
      comment: app.comment,
      status: app.status,
      cost: app.cost,
      responsibleId: app.responsibleId,
      pubs: application.pubs,
      userId: user.id,
    };
    return { application: flattenedApp, email: app.user.email };
  }
  async changeApplicationStatus(id: number, status: ApplicationStatus) {
    const application = await this.prisma.application.update({
      where: {
        id: id,
      },
      data: {
        status: ApplicationStatus[status],
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    return application;
  }
  async deleteApplication(applicationId: number) {
    await this.prisma.application.delete({
      where: {
        id: applicationId,
      },
    });
    return { id: applicationId };
  }
  async deleteMyApplication(user: UserInfo, applicationId: number) {
    if (user.role === UserRole.user) {
      const application = await this.prisma.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          user: true,
        },
      });
      if (user.id !== application.user.id) {
        throw new ForbiddenException('no access');
      }
    }

    await this.prisma.application.delete({
      where: {
        id: Number(applicationId),
      },
    });
  }
  async setApplicationResponsible(id: number, user: UserInfo) {
    const application = await this.prisma.application.update({
      where: {
        id,
      },
      data: {
        responsibleId: user.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    return {
      id: application.id,
      responsibleId: application.responsibleId,
      responsibleEmail: user.email,
      email: application.user.email,
    };
  }
}
