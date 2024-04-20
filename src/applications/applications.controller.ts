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
    const res = await this.applications.sendApplication(dto, user);

    const to = dto.email;
    const subject = 'Заявка оставлена';
    const html = `
    <p>
    Здравствуйте, ${res.email}!. Вы оставили заявку в рекламном агенстве STARPLATINUM. Ее уникальный номер: #${res.id}. После рассмотрения, мы свяжемся с Вами для уточнения деталей.
    </p>
    <p>С уважением, команда STARPLATINUM</p>
    `;
    try {
      await this.emailService.sendEmail(to, subject, html);
    } catch (err) {
      console.log('Error while sending email', err);
    }
    return res;
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async changeApplicationStatus(
    @Param('id') id: string,
    @Body() dto: ChangeApplicationStatusDto,
  ) {
    const res = await this.applications.changeApplicationStatus(
      Number(id),
      dto.status,
    );

    const to = res.email;
    let subject: string;
    let html: string;
    if (res.status === ApplicationStatus.ACCEPTED) {
      subject = 'Заявка одобрена';
      html = `
      <p>
      Здравствуйте, ${to}!. Ваша заявка была одобрена! Итого к оплате: ${res.cost} руб. Мы свяжемся с Вами для уточнения деталей и оплаты.
      </p>
      <p>С уважением, команда STARPLATINUM</p>
      `;
    } else if (res.status === ApplicationStatus.CANCELED) {
      subject = 'Заявка отклонена';
      html = `
      <p>
      Здравствуйте, ${to}!. Ваша заявка была отклонена. Мы свяжемся с Вами для уточнения деталей
      </p>
      <p>С уважением, команда STARPLATINUM</p>
      `;
    }
    if (res.status !== ApplicationStatus.PENDING) {
      try {
        await this.emailService.sendEmail(to, subject, html);
      } catch (err) {
        console.log('Error while sending email', err);
      }
    }
    return res;
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
