import { Expose, Type } from 'class-transformer';

// DTO para el producto en el OrderItem
export class ProductDto {
  @Expose()
  product_id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: string;

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
  @Type(() => ProductDto) // Asegura que el producto se transforme en un objeto ProductDto
  product: ProductDto;
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
  @Type(() => OrderItemDto) // Asegura que los items se transformen en objetos OrderItemDto
  items: OrderItemDto[];
}
