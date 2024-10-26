import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  slots: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  status: number;

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'instructor' })
  user: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'course_students', // Nombre de la tabla de unión
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
  })
  students: User[];
}
