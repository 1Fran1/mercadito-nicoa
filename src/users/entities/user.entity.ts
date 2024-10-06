import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, JoinColumn, OneToOne } from 'typeorm';


@Entity('users') // El nombre de la tabla será 'users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

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
 
}
