import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { UpdateEntrepreneurDto } from './dto/update-entrepreneur.dto';
import { EntrepreneurService } from './entrepreneurs.service';
import { ApiTags } from '@nestjs/swagger';


@Controller('entrepreneurs')
@ApiTags('entrepreneurs')
export class EntrepreneurController {
  constructor(private readonly entrepreneurService: EntrepreneurService) {}

  @Get()
  async findAll(): Promise<Entrepreneur[]> {
    return this.entrepreneurService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Entrepreneur> {
    return this.entrepreneurService.findOne(id);
  }

  @Post()
  async create(@Body() createEntrepreneurDto: CreateEntrepreneurDto): Promise<Entrepreneur> {
    return this.entrepreneurService.create(createEntrepreneurDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEntrepreneurDto: UpdateEntrepreneurDto,
  ): Promise<Entrepreneur> {
    return this.entrepreneurService.update(id, updateEntrepreneurDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.entrepreneurService.remove(id);
  }
}
