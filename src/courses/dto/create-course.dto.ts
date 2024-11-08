import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate, Length, Min, Max } from 'class-validator';

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

  @IsOptional()
  @Length(0, 1, {
    message: '',
  })
  status?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Los puntos de publicidad deben ser un número' })
  @Min(1, { message: 'Los puntos de publicidad deben ser al menos 1' })
  @Max(5, { message: 'Los puntos de publicidad no pueden superar 5' })
  advertisementPoints?: number;

  @IsNumber()
  @IsNotEmpty()
  instructorId: number; 



  @IsNumber()
  @IsNotEmpty()
  studentId: number; 

}



