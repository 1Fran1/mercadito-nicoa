import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const user = await this.usersRepository.findOne({
      where: { id: createCourseDto.instructorId },
    });
    if (!user) {
      throw new NotFoundException('Instructor not found');
    }

    const course = this.coursesRepository.create({
      ...createCourseDto,
      user,
    });

    return this.coursesRepository.save(course);
  }

  findAll(): Promise<Course[]> {
    return this.coursesRepository.find({ relations: ['user', 'students'] });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['user', 'students'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.coursesRepository.preload({
      id: id,
      ...updateCourseDto,
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.coursesRepository.save(course);
  }

  async updateSlots(id: number, slots: number): Promise<Course> {
    const course = await this.findOne(id);
    course.slots = slots;
    return this.coursesRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
  }

  // Método para agregar un estudiante a un curso sin reemplazar estudiantes anteriores
  async addStudentToCourse(courseId: number, studentId: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
      relations: ['students'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const student = await this.usersRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Agrega el estudiante solo si aún no está en la lista
    if (!course.students.some((existingStudent) => existingStudent.id === student.id)) {
      course.students.push(student);
    }

    return this.coursesRepository.save(course);
  }

  // Método para eliminar un estudiante de un curso (desinscripción)
  async removeStudentFromCourse(courseId: number, studentId: number): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
      relations: ['students'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const student = await this.usersRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Eliminar el registro en la tabla intermedia `course_students` usando QueryBuilder de DataSource
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('course_students')
      .where('course_id = :courseId', { courseId })
      .andWhere('student_id = :studentId', { studentId })
      .execute();
  }

 // Método para obtener los estudiantes de un curso específico
 async getStudentsByCourse(courseId: number): Promise<User[]> {
  const course = await this.coursesRepository.findOne({
    where: { id: courseId },
    relations: ['students'], // Cargar la relación de estudiantes
  });

  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found`);
  }

  return course.students;
}
}

  

