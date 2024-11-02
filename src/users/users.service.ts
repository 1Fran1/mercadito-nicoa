import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      // Verificar si ya existe un usuario con el mismo email
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10); // Asegúrate de que esto ocurre solo una vez

      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword, // Guarda la contraseña encriptada
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  // Obtener un usuario por ID
  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the user');
    }
  }

  // Actualizar un usuario
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
      });

      if (updateUserDto.password) {
        // Encriptar la nueva contraseña si se envía en la actualización
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      Object.assign(user, updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update user with ID ${id}`,
      );
    }
  }

  // Eliminar un usuario
  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);

      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to remove user with ID ${id}`,
      );
    }
  }

  // Encontrar un usuario por email
  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAllEntrepreneurs(): Promise<User[]> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'Emprendedor' });

      const entrepreneurs = await query.getMany();
      console.log('Entrepreneurs found:', entrepreneurs);
      return entrepreneurs;
    } catch (error) {
      console.error(
        'Error al obtener emprendedores:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve entrepreneurs',
      );
    }
  }

    // Método para obtener los cursos en los que está inscrito un usuario
  async getEnrolledCourses(userId: number): Promise<Course[]> {
    try {
      // Usamos QueryBuilder para obtener todos los cursos asociados al usuario usando la tabla intermedia
      const courses = await this.courseRepository
        .createQueryBuilder('course')
        .innerJoin('course.students', 'student') // Usamos la relación ManyToMany students
        .innerJoin('course_students', 'cs', 'cs.course_id = course.id AND cs.student_id = :userId', { userId }) // Unión explícita con la tabla intermedia
        .getMany();

      if (!courses.length) {
        throw new NotFoundException(`No courses found for user with ID ${userId}`);
      }

      return courses;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw new InternalServerErrorException(
        `Failed to retrieve courses for user with ID ${userId}`,
      );
    }
  }
}