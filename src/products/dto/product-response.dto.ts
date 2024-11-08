import { Expose, Type } from 'class-transformer';

export class EntrepreneurDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

}

export class ProductResponseDto {
  @Expose()
  product_id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  unit: string;

  @Expose()
  image: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  status: number;

  @Expose()
  @Type(() => EntrepreneurDto) // Relación con el emprendedor
  user: EntrepreneurDto;
}
