import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const user = await this.usersRepository.findOne({ where: { id: createCourseDto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const course = this.coursesRepository.create({
      ...createCourseDto,
      user,
    });
  
    return this.coursesRepository.save(course);
  }
  

 findAll(): Promise<Course[]> {
  return this.coursesRepository.find({ relations: ['user'] });
}

async findOne(id: number): Promise<Course> {
 
  const course = await this.coursesRepository.findOne({ where: { id }, relations: ['user'] });
  
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

   // Nueva función para actualizar los slots
   async updateSlots(id: number, slots: number): Promise<Course> {
    const course = await this.findOne(id);

    // Actualiza solo el campo de slots
    course.slots = slots;

    return this.coursesRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepository.remove(course);
  }
}
