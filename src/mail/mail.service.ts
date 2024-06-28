import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSignupVerificationMail(email: string, code: string) {
    const verificationUrl = `http://127.0.0.1:3000/verify?code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: '[클래스비누] 10분 안에 인증을 완료해 주세요.',
      html: `이 곳을 클릭하면 인증이 완료됩니다.<br>
      <a href="${verificationUrl}" target="_blank">${verificationUrl}</a> `,
    });
  }
}
