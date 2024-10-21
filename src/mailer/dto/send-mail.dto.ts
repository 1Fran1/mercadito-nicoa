import {
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
    IsNotEmpty,
    IsEmail,
    IsObject,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { SendMailOptions } from 'nodemailer';
  
  class Address {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    address: string;
  }
  
  export class SendEmailDto {
    @IsOptional()
    @IsObject()
    from?: Address;
  
    @IsNotEmpty()
    @IsArray()
    to: Address[];
  
    @IsNotEmpty()
    @IsString()
    subject: string;
  
    @IsNotEmpty()
    @IsString()
    html: string;
  
    @IsOptional()
    @IsString()
    text?: string;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object) // Transforma los adjuntos a objetos
    attachments?: SendMailOptions['attachments']; // Adjuntos opcionales
  }