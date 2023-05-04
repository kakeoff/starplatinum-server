import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';
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

  @Get()
  getApplications() {
    return this.applications.getAllApplications();
  }

  @Post()
  async sendApplication(@Body() dto: SendApplicationDto) {
    const res = await this.applications.sendApplication(dto);

    const to = dto.email;
    const subject = 'Заявка оставлена';
    const html = `
    <p>
    Здравствуйте, ${res.email}!. Вы оставили заявку в рекламном агенстве STARPLATINUM. Ее уникальный номер: #${res.id}. После рассмотрения, мы свяжемся с Вами для уточнения деталей.
    </p>
    <p>С уважением, команда STARPLATINUM</p>
    `;
    await this.emailService.sendEmail(to, subject, html);
    return res;
  }

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
      Здравствуйте, ${res.email}!. Ваша заявка была одобрена! Итого к оплате: ${res.cost} руб. Мы свяжемся с Вами для уточнения деталей и оплаты.
      </p>
      <p>С уважением, команда STARPLATINUM</p>
      `;
    } else if (res.status === ApplicationStatus.CANCELED) {
      subject = 'Заявка отклонена';
      html = `
      <p>
      Здравствуйте, ${res.email}!. Ваша заявка была отклонена. Мы свяжемся с Вами для уточнения деталей
      </p>
      <p>С уважением, команда STARPLATINUM</p>
      `;
    }
    if (res.status !== ApplicationStatus.PENDING) {
      await this.emailService.sendEmail(to, subject, html);
    }
    return res;
  }

  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') applicationId: number) {
    return this.applications.deleteApplication(applicationId);
  }
}
