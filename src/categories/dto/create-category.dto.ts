import { IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  name: string;

  @IsOptional()
  @Length(0, 255, {
    message: 'La descripción puede tener hasta 255 caracteres',
  })
  description?: string;
}

export class UpdateCategoryDto {
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
}
``
