import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { UsersService } from 'src/users/users.service';


@Module({
  imports: [TypeOrmModule.forFeature([
    Roles,
    UsersService
  ])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
