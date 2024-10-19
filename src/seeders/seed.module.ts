import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from 'src/users/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Asegúrate de inyectar los repositorios necesarios
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
