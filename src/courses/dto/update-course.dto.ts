import {IsString, IsNotEmpty, IsOptional, IsNumber, IsDate, Length  } from 'class-validator';


export class UpdateCourseDto  {

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

  @IsNumber()
  @IsNotEmpty()
  userId: number; 


}
