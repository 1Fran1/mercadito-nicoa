import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../products/dto/product-response.dto';


// DTO para el usuario en la orden
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  address: string;
}

// DTO para cada item en la orden
export class OrderItemDto {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  unit_price: number;

  @Expose()
  @Type(() => ProductResponseDto) // Usa ProductResponseDto para el producto
  product: ProductResponseDto;
}

// DTO principal para la orden completa
export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  total_price: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => UserDto) // Asegura que el usuario se transforme en un objeto UserDto
  user: UserDto;

  @Expose()
  @Type(() => OrderItemDto) // Asegura que los items se transformen en objetos OrderItemDto
  items: OrderItemDto[];
}