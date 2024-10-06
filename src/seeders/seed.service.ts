import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Crear el usuario admin
  async seedAdminUser() {
    try {
      // Verificar si ya existe un usuario admin
      const existingAdmin = await this.userRepository.findOne({ where: { email: 'admin@gmail.com' } });
      if (existingAdmin) {
        console.log('El usuario admin ya existe');
        return;
      }

      // Crear el usuario admin
      const password = await bcrypt.hash('Admin12345', 10); // Encripta la contraseña
      const adminUser = this.userRepository.create({
        name: 'Usuario Admin',
        email: 'admin@gmail.com',
        address: 'Oficina',
        phone: '1234567890',
        password: password,
        role: 'Admin', // Asignación directa del rol como 'admin'
      });

      await this.userRepository.save(adminUser);
      console.log('Usuario admin creado con éxito');
    } catch (error) {
      console.error('Error al crear el usuario admin:', error);
      throw new InternalServerErrorException('Failed to create admin user');
    }
  }
}
