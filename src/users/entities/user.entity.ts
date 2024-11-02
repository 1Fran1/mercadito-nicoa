import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Course } from 'src/courses/entities/course.entity'; 
import { Order } from 'src/order/entities/order.entity'; 

@Entity('users') // El nombre de la tabla será 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
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
  role: string;

  @Column('text', { nullable: true })
  image: string;

  @Column()
  status: number;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  // Relación con Course
  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  // Relación con Order (nuevo)
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
