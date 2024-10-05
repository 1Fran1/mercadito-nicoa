import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_roles') 
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación de muchos a uno con User
  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' }) // La columna user_id en user_roles será la FK hacia User
  user: User;

  // Relación de muchos a uno con Role
  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' }) // La columna role_id en user_roles será la FK hacia Role
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
