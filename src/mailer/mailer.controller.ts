import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('email')
export class EmailController {
  constructor(private readonly mailerService: MailerService){}
}