import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserRole } from '../../user_role/entities/user_role.entity';

@Entity('roles') // El nombre de la tabla será 'roles'
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  @OneToOne(() => UserRole, userRole => userRole.role)
  userRole: UserRole;
}
