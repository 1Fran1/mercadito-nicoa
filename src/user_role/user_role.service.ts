import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';
import { UserRole } from './entities/user_role.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UserRoleService {
  // Inyectar repositorios
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>, // Repositorio de UserRole

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Repositorio de User

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>, // Repositorio de Role
  ) {}

  // Crear una nueva asignación de rol a un usuario
  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    try {
      const { userId, roleId } = createUserRoleDto;

      // Buscar el usuario y el rol
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const role = await this.roleRepository.findOne({ where: { id: roleId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      // Crear la nueva relación UserRole
      const newUserRole = this.userRoleRepository.create({
        user,
        role,
      });

      return await this.userRoleRepository.save(newUserRole);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user role assignment');
    }
  }

  // Obtener todas las asignaciones de roles a usuarios
  async findAll(): Promise<UserRole[]> {
    try {
      return await this.userRoleRepository.find({
        relations: ['user', 'role'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user role assignments');
    }
  }

  // Obtener una asignación específica por ID
  async findOne(id: number): Promise<UserRole> {
    try {
      const userRole = await this.userRoleRepository.findOne({
        where: { id },
        relations: ['user', 'role'],
      });
      if (!userRole) {
        throw new NotFoundException(`User role assignment with ID ${id} not found`);
      }
      return userRole;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the user role assignment');
    }
  }

  // Actualizar una asignación de rol a usuario
  async update(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<UserRole> {
    try {
      const userRole = await this.findOne(id);
      const { userId, roleId } = updateUserRoleDto;

      if (userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        userRole.user = user;
      }

      if (roleId) {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
          throw new NotFoundException(`Role with ID ${roleId} not found`);
        }
        userRole.role = role;
      }

      return await this.userRoleRepository.save(userRole);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update user role assignment with ID ${id}`);
    }
  }

  // Eliminar una asignación de rol a usuario
  async remove(id: number): Promise<void> {
    try {
      const userRole = await this.findOne(id);
      await this.userRoleRepository.remove(userRole);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to remove user role assignment with ID ${id}`);
    }
  }

  // Encontrar un rol por nombre
  async findRoleByName(roleName: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { name: roleName } });
  }

  // Encontrar roles asignados a un usuario
  async findRolesByUserId(userId: number): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['role'],
    });
  }
}
