// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Course } from '../courses/entities/course.entity'; // Importa el entity de Course
import { CoursesModule } from '../courses/courses.module'; // Importa el módulo de Courses

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course]), // Añade Course aquí también
    CoursesModule, // Importa el módulo de Courses
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
