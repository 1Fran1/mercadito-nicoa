import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Cambia esta línea
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contacts.service';
import { ContactController } from './contacts.controller';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), HttpModule], // Usa HttpModule de @nestjs/axios
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
