import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, HttpCode, ParseIntPipe
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags } from '@nestjs/swagger';
import {User} from '../users/entities/user.entity'

@Controller('courses')
@ApiTags('Courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Patch(':id/slots')
  updateSlots(@Param('id') id: number, @Body('slots') slots: number) {
    return this.coursesService.updateSlots(id, slots);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coursesService.remove(id);
  }

  @Post(':courseId/students')
  addStudentToCourse(
    @Param('courseId') courseId: number,
    @Body('studentId') studentId: number,
  ) {
    return this.coursesService.addStudentToCourse(courseId, studentId);
  }

 // Endpoint para eliminar un estudiante de un curso
 @Delete(':courseId/students/:studentId')
  @HttpCode(204)
  async removeStudent(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ): Promise<void> {
    await this.coursesService.removeStudentFromCourse(courseId, studentId);
  }

 @Get(':id/students')
 async getStudentsByCourse(@Param('id') id: number): Promise<User[]> {
   return this.coursesService.getStudentsByCourse(id);
 }
}
