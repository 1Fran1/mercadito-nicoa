import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailController } from './mailer.controller';

@Module({
  providers: [MailerService],
  controllers: [EmailController],
  exports: [MailerService],
})
export class MailerModule {}