import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

  
// export enum CategoryStatus {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
// }


  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    category_id: number;
  
    @Column({ unique: true })
    @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
    @Length(3, 100, {
      message: 'El nombre de la categoría debe tener entre 3 y 100 caracteres',
    })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    @Length(0, 255, {
      message: 'La descripción debe tener un máximo de 255 caracteres',
    })
    description: string;
  
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;


   




  }
  