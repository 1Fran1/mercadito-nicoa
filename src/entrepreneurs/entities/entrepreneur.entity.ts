import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { IsNotEmpty, Length } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

  
  @Entity()
  export class Entrepreneur {
    @PrimaryGeneratedColumn()
    entrepreneur_id: number;
  
    @Column()
    @IsNotEmpty({ message: 'El nombre del emprendedor es obligatorio' })
    @Length(3, 100, {
      message: 'El nombre debe tener entre 3 y 100 caracteres',
    })
    name: string;


    @Column('text', {nullable: true})
    image: string;
  

  
    @Column({ type: 'text', nullable: true })
    @Length(0, 255, {
      message: 'La descripción puede tener hasta 255 caracteres',
    })
    description?: string;
  
    @OneToMany(() => Product, (product) => product.entrepreneur)
    products: Product[];
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  