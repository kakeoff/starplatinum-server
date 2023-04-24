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
    const to = dto.email;
    const subject = 'Заявка оставлена';
    const html = `
    <p>
    Здравствуйте, ${dto.email}!. Вы оставляли заявку в рекламном агенстве STARPLATINUM. Мы свяжемся с Вами для уточнения деталей.
    </p>
    <p>С уважением, команда STARPLATINUM</p>
    `;
    await this.emailService.sendEmail(to, subject, html);
    return this.applications.sendApplication(dto);
  }

  @Delete(':applicationId')
  deleteApplication(@Param('applicationId') applicationId: number) {
    return this.applications.deleteApplication(applicationId);
  }
}
