import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Crear un nuevo rol
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      // Verificar si el rol ya existe
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
      });
      if (existingRole) {
        throw new BadRequestException(
          `Role with name "${createRoleDto.name}" already exists`,
        );
      }

      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  // Obtener todos los roles
  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve roles');
    }
  }

  // Obtener un rol por su ID
  async findOne(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the role');
    }
  }

  // Actualizar un rol
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id);

      // Actualizar el rol
      Object.assign(role, updateRoleDto);
      return await this.roleRepository.save(role);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update role with ID ${id}`,
      );
    }
  }

  // Eliminar un rol
  async remove(id: number): Promise<void> {
    try {
      const role = await this.findOne(id);

      await this.roleRepository.remove(role);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to remove role with ID ${id}`,
      );
    }
  }
}
