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
import { User } from 'src/users/entities/user.entity';



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
  unit: string;

  @Column('text', {nullable: true})
  image: string;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @Column()//{
  @IsNotEmpty({ message: 'Status is required' })
  status: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })  // Asegúrate de que el nombre de la columna sea correcto
  category: Category;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })  // Asegúrate de que el nombre de la columna sea correcto
  user: User;





}
