import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/user_role/entities/user_role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, UserRole]), // Asegúrate de inyectar los repositorios necesarios
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
