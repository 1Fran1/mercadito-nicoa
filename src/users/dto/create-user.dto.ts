import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name is required' })
  @MaxLength(100, { message: 'Name is too long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(100, { message: 'Email is too long' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Address must be a string' })
  @MaxLength(255, { message: 'Address is too long' })
  @IsOptional()
  address?: string; // Campo opcional

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Phone must be a string' })
  @MinLength(7, { message: 'Phone number is too short' })
  @MaxLength(15, { message: 'Phone number is too long' })
  phone: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
