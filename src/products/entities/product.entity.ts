import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Length, IsEnum } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Entrepreneur } from 'src/entrepreneurs/entities/entrepreneur.entity';

// export enum ProductStatus {
//   AVAILABLE = 'available',
//   OUT_OF_STOCK = 'out_of_stock',
//   DISCONTINUED = 'discontinued',
// }



@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @Length(3, 100, {
    message: 'El nombre debe tener entre 3 y 100 caracteres',
  })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('decimal')
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;


  @Column('text', {nullable: true})
  image: number;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @Column()//{
  //   type: 'enum',
  //   enum: ProductStatus,
  //   default: ProductStatus.AVAILABLE,
  // })
  // @IsEnum(ProductStatus, { message: 'Status must be one of: available, out_of_stock, discontinued' })
  @IsNotEmpty({ message: 'Status is required' })
  status: number;



  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })  // Asegúrate de que el nombre de la columna sea correcto
  category: Category;

  @ManyToOne(() => Entrepreneur, (entrepreneur) => entrepreneur.products)
  @JoinColumn({ name: 'entrepreneur_id' })  // Asegúrate de que el nombre de la columna sea correcto
  entrepreneur: Entrepreneur;





}
