import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  slots: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  userId: number; 
}
