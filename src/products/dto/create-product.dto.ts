import { IsNotEmpty, IsNumber, Min, Length, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  name: string;

  @IsOptional()
  @Length(0, 255, {
    message: 'La descripción puede tener hasta 255 caracteres',
  })
  description?: string;

  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNotEmpty({ message: 'La categoría del producto es obligatoria' })
  category_id: number;

  @IsOptional()
  entrepreneur_id?: number;
}
