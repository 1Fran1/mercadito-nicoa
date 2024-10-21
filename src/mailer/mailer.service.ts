import { Injectable } from '@nestjs/common';
import { MailerService as BaseMailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-mail.dto';


@Injectable()
export class MailerService {
  constructor(private readonly mailerService: BaseMailerService) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    await this.mailerService.sendMail(sendEmailDto);
 }
}