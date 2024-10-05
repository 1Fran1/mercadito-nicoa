import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_roles') 
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(() => User)
  @JoinColumn() 
  user: User;

 
  @OneToOne(() => Role)
  @JoinColumn() 
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
