import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../user_role/entities/user_role.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async seedRoles() {
    const roles = [
      { name: 'admin', description: 'Administrator with full access to all resources.' },
      { name: 'emprendedor', description: '.' },
      { name: 'cliente', description: '.' },
    ];

    for (const roleData of roles) {
      const role = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (!role) {
        await this.roleRepository.save(this.roleRepository.create(roleData));
      }
    }

    // Crear el usuario admin después de insertar los roles
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    try {
      // Verificar si ya existe un usuario admin
      const existingAdmin = await this.userRepository.findOne({ where: { email: 'admin@gmail.com' } });
      if (existingAdmin) {
        console.log('El usuario admin ya existe');
        return;
      }

      // Buscar el rol admin
      const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });
      if (!adminRole) {
        throw new InternalServerErrorException('Role admin no encontrado');
      }

      // Crear el usuario admin
      const password = await bcrypt.hash('Admin12345', 10); // Encripta la contraseña
      const adminUser = this.userRepository.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        phone: '1234567890',
        password: password,
      });

      const savedAdmin = await this.userRepository.save(adminUser);

      // Asignar el rol admin al usuario
      const userRole = this.userRoleRepository.create({
        user: savedAdmin,
        role: adminRole,
        isActive: true,
      });

      await this.userRoleRepository.save(userRole);
      console.log('Usuario admin creado con éxito');
    } catch (error) {
      console.error('Error al crear el usuario admin:', error);
      throw new InternalServerErrorException('Failed to create admin user');
    }
  }
}
