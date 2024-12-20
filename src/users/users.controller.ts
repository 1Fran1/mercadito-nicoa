import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Course } from 'src/courses/entities/course.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

   // Nueva ruta para verificar si el correo ya existe
   @Get('check-email/:email')
   async checkEmail(@Param('email') email: string) {
     const user = await this.usersService.findOneByEmail(email);
     if (user) {
       return { exists: true };
     }
     return { exists: false };
   }

   @Get('entrepreneurs')
   findAllEntrepreneurs() {
     return this.usersService.findAllEntrepreneurs();
   }

    
  // Nuevo endpoint para obtener cursos inscritos de un usuario
  @Get(':id/enrolled-courses')
  async getEnrolledCourses(@Param('id') id: string): Promise<Course[]> {
    return this.usersService.getEnrolledCourses(+id);
  }
}