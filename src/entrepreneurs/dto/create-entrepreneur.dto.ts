import { IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateEntrepreneurDto {
  @IsNotEmpty({ message: 'El nombre del emprendedor es obligatorio' })
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  name: string;

  @Length(0, 255, {
    message: 'La descripción puede tener hasta 255 caracteres',
  })
  description?: string;
}

export class UpdateEntrepreneurDto {
  @IsOptional()
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  name?: string;

  @IsOptional()
  @Length(0, 255, {
    message: 'La descripción puede tener hasta 255 caracteres',
  })
  description?: string;

  @IsOptional()
  @Length(0, 255, {
    message: '',
  })
  image?: string;

  @IsOptional()
  @Length(0, 1, {
    message: '',
  })
  status?: string;
}
