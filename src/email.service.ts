import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationStatus } from '@prisma/client';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const transporter = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
    try {
      await transporter.sendMail({
        from: 'starplatinumapp@mail.ru',
        to,
        subject,
        html,
      });
    } catch (err) {
      console.log('Error while sending email', err);
    }
  }

  async createResponsibleMail(data: {
    id: number;
    responsibleEmail: string;
    email: string;
  }): Promise<void> {
    const to = data.email;
    const subject = 'STARPLATINUM - Администратор начал работу по Вашей заявке';
    const html = `
      <p>
        Здравствуйте, ${data.email}!. На связи STARPLATINUM. Администратор начал работу по заявке <b>#${data.id}</b>. По всем вопросам можете обращаться на его email <b>${data.responsibleEmail}</b>.
      </p>
      <p>С уважением, команда STARPLATINUM</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async createApplicationMail(data: {
    id: number;
    email: string;
  }): Promise<void> {
    const to = data.email;
    const subject = 'Заявка оставлена';
    const html = `
    <p>
    Здравствуйте, ${data.email}!. Вы оставили заявку в рекламном агенстве STARPLATINUM. Ее уникальный номер: #${data.id}. После рассмотрения, мы свяжемся с Вами для уточнения деталей.
    </p>
    <p>С уважением, команда STARPLATINUM</p>
    `;
    await this.sendEmail(to, subject, html);
  }

  async createApplicationStatusMail(data: {
    email: string;
    status: ApplicationStatus;
    cost: number;
  }): Promise<void> {
    const to = data.email;
    let subject = '';
    let html = '';
    if (data.status === ApplicationStatus.ACCEPTED) {
      subject = 'Заявка одобрена';
      html = `
      <p>
      Здравствуйте, ${to}!. Ваша заявка была одобрена! Итого к оплате: ${data.cost} руб. Мы свяжемся с Вами для уточнения деталей и оплаты.
      </p>
      <p>С уважением, команда STARPLATINUM</p>
      `;
    } else if (data.status === ApplicationStatus.CANCELED) {
      subject = 'Заявка отклонена';
      html = `
      <p>
      Здравствуйте, ${to}!. Ваша заявка была отклонена. Мы свяжемся с Вами для уточнения деталей
      </p>
      <p>С уважением, команда STARPLATINUM</p>
      `;
    }
    await this.sendEmail(to, subject, html);
  }
}
