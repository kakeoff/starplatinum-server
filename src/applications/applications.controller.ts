import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/user.decorator';
import { UserInfo } from 'src/types';
import { AdminGuard } from 'src/user/admin.guard';
import { EmailService } from '../email.service';
import {
  ChangeApplicationStatusDto,
  SendApplicationDto,
} from './applications.dto';
import { ApplicationsService } from './applications.service';

@Controller('applications')
@UseGuards(AuthGuard)
export class ApplicationsController {
  constructor(
    private applications: ApplicationsService,
    private emailService: EmailService,
  ) {}

  @UseGuards(AdminGuard)
  @Get()
  getApplications() {
    return this.applications.getAllApplications();
  }

  @Get('user/:id')
  getUserApplicationsApplications(@Param('id') id: string) {
    return this.applications.getUserApplications(Number(id));
  }

  @Post()
  async sendApplication(
    @Body() dto: SendApplicationDto,
    @GetUser() user: UserInfo,
  ) {
    const data = await this.applications.sendApplication(dto, user);

    await this.emailService.createApplicationMail({
      id: data.application.id,
      email: data.email,
    });

    return data.application;
  }

  @UseGuards(AdminGuard)
  @Patch('/responsible')
  async setApplicationResponsible(
    @GetUser() user: UserInfo,
    @Body() dto: { applicationId: number; responsibleId: number | null },
  ) {
    const data = await this.applications.setApplicationResponsible(
      dto.applicationId,
      user,
      dto.responsibleId,
    );
    if (data.responsibleId) {
      await this.emailService.createResponsibleMail({
        id: data.id,
        responsibleEmail: data.responsibleEmail,
        email: data.email,
      });
    }
    return {
      id: data.id,
      responsibleId: data.responsibleId,
    };
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async changeApplicationStatus(
    @Param('id') id: string,
    @Body() dto: ChangeApplicationStatusDto,
  ) {
    const application = await this.applications.changeApplicationStatus(
      Number(id),
      dto.status,
    );
    if (application.status !== ApplicationStatus.PENDING) {
      await this.emailService.createApplicationStatusMail({
        email: application.user.email,
        status: application.status,
        cost: application.cost,
      });
    }
    return { id: application.id, status: application.status };
  }

  @UseGuards(AdminGuard)
  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') applicationId: string) {
    return this.applications.deleteApplication(Number(applicationId));
  }

  @Delete('user/:applicationId')
  deleteMyApplication(
    @GetUser() user: UserInfo,
    @Param('applicationId') applicationId: string,
  ) {
    return this.applications.deleteMyApplication(user, Number(applicationId));
  }
}
