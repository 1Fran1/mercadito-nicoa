import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
import { firstValueFrom } from 'rxjs'; // Necesario para manejar promesas

@Injectable()
export class ContactService {
  private readonly CAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

  constructor(
    private httpService: HttpService,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async validateCaptcha(captchaToken: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpService.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        {},
        {
          params: {
            secret: this.CAPTCHA_SECRET,
            response: captchaToken,
          },
        },
      ),
    );

    return response.data.success;
  }

  async createContact(createContactDto: CreateContactDto) {
    const { captchaToken, ...contactData } = createContactDto;

    const isCaptchaValid = await this.validateCaptcha(captchaToken);
    if (!isCaptchaValid) {
      throw new BadRequestException('Invalid CAPTCHA');
    }

    const contact = this.contactRepository.create(contactData);
    return this.contactRepository.save(contact);
  }

   // Método para obtener todos los contactos
   async findAllContacts(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOneBy({id});
    if (!contact) {
      throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
    }
    return contact;
  }
}
