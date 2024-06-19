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
            createdAt: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const flattenedApplications = applications.map((app) => {
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
            createdAt: pub.createdAt,
          };
        }),
        userId: app.user.id,
        createdAt: app.createdAt,
      };
    });

    return flattenedApplications;
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
            createdAt: true,
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const flattenedApplications = applications.map((app) => {
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
            createdAt: pub.createdAt,
          };
        }),
        userId: app.user.id,
        createdAt: app.createdAt,
      };
    });

    return flattenedApplications;
  }

  async sendApplication(applicationDto: SendApplicationDto, user: UserInfo) {
    if (!user && !user.id) {
      throw new ForbiddenException('user not found');
    }

    const publicationsToCreateData = applicationDto.pubs.map((pub) => {
      return {
        publicationId: pub.id,
        publicationDate: pub.date,
      };
    });
    const createdApplication = await this.prisma.application.create({
      data: {
        comment: applicationDto.comment,
        cost: applicationDto.cost,
        userId: user.id,
        applicationPublications: {
          createMany: {
            data: publicationsToCreateData,
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        applicationPublications: {
          select: {
            applicationId: true,
            publicationDate: true,
            publicationId: true,
            createdAt: true,
          },
        },
      },
    });
    const flattenedApp = {
      id: createdApplication.id,
      comment: createdApplication.comment,
      status: createdApplication.status,
      cost: createdApplication.cost,
      responsibleId: createdApplication.responsibleId,
      pubs: createdApplication.applicationPublications.map((pub) => {
        return {
          id: pub.publicationId,
          date: pub.publicationDate,
          createdAt: pub.createdAt,
        };
      }),
      userId: user.id,
      createdAt: createdApplication.createdAt,
    };
    return { application: flattenedApp, email: createdApplication.user.email };
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
  async setApplicationResponsible(
    id: number,
    user: UserInfo,
    responsibleId: number | null,
  ) {
    const application = await this.prisma.application.update({
      where: {
        id,
      },
      data: {
        responsibleId: responsibleId,
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
