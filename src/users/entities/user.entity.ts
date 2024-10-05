import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../user_role/entities/user_role.entity';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
