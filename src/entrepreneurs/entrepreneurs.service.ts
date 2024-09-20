import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { UpdateEntrepreneurDto } from './dto/update-entrepreneur.dto';


@Injectable()
export class EntrepreneurService {
  constructor(
    @InjectRepository(Entrepreneur)
    private readonly entrepreneurRepository: Repository<Entrepreneur>,
  ) {}


  async findAll(): Promise<Entrepreneur[]> {
    return this.entrepreneurRepository.find({ relations: ['products'] });
  }


  async findOne(id: number): Promise<Entrepreneur> {
    const entrepreneur = await this.entrepreneurRepository.findOne({
      where: { entrepreneur_id: id },
      relations: ['products'],
    });
    if (!entrepreneur) {
      throw new NotFoundException(`Emprendedor con ID ${id} no encontrado`);
    }
    return entrepreneur;
  }

  async create(createEntrepreneurDto: CreateEntrepreneurDto): Promise<Entrepreneur> {
    const entrepreneur = this.entrepreneurRepository.create(createEntrepreneurDto);
    return this.entrepreneurRepository.save(entrepreneur);
  }


  async update(id: number, updateEntrepreneurDto: UpdateEntrepreneurDto): Promise<Entrepreneur> {
    const entrepreneur = await this.entrepreneurRepository.preload({
      entrepreneur_id: id,
      ...updateEntrepreneurDto,
    });

    if (!entrepreneur) {
      throw new NotFoundException(`Emprendedor con ID ${id} no encontrado`);
    }

    return this.entrepreneurRepository.save(entrepreneur);
  }


  async remove(id: number): Promise<void> {
    const result = await this.entrepreneurRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Emprendedor con ID ${id} no encontrado`);
    }
  }
}
