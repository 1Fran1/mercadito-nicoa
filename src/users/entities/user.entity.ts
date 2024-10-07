import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';


@Entity('users') // El nombre de la tabla será 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Length(0, 255, {
    message: 'La descripción puede tener hasta 255 caracteres',
  })
  description?: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 15 })
  phone: string;

  @Column()
  password: string;

  @Column()
  role: string

  @Column('text', {nullable: true})
  image: string;

  @Column()
    @IsNotEmpty({ message: 'El estado es requisito' })
    status: number;

  @OneToMany(() => Product, (product) => product.user)
    products: Product[];
 
}
