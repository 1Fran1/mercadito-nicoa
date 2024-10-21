import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerConfig implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('MAIL_HOST'), // smtp.gmail.com
        port: this.configService.get<number>('MAIL_PORT'),  // 587
        secure: false, // Asegúrate de que esté en false para STARTTLS (puerto 587)
        auth: {
          user: this.configService.get<string>('MAIL_USER'), // tu-correo@gmail.com
          pass: this.configService.get<string>('MAIL_PASSWORD'), // tu contraseña de aplicación
        },
        tls: {
          rejectUnauthorized: false, // Asegúrate de que no rechace certificados no autorizados
        },
      },
      defaults: {
        from: `"No Reply" <${this.configService.get<string>('MAIL_FROM')}>`, // Dirección predeterminada
      },
    };
  }
}
