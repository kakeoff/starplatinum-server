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
export class ApplicationsController {
  constructor(
    private applications: ApplicationsService,
    private emailService: EmailService,
  ) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  getApplications() {
    return this.applications.getAllApplications();
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id/status')
  async changeApplicationStatus(
    @Param('id') id: number,
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
      await this.emailService.sendEmail(to, subject, html);
    }
    return res;
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') applicationId: number) {
    return this.applications.deleteApplication(applicationId);
  }
}
