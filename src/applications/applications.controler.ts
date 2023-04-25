import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EmailService } from '../email.service';
import { SendApplicationDto } from './applications.dto';
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

  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') applicationId: number) {
    return this.applications.deleteApplication(applicationId);
  }
}
