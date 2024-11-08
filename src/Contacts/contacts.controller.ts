// src/contact/contact.controller.ts
import { Controller, Post, Body, Get,   Param, ParseIntPipe,  } from '@nestjs/common';
import { ContactService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }

  @Get()
  async getAllContacts(): Promise<Contact[]> {
    return this.contactService.findAllContacts();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Contact> {
    return this.contactService.findOne(id);
  }
}
