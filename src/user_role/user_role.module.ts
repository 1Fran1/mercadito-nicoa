import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleService } from './user_role.service';
import { UserRole } from './entities/user_role.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRoleController } from './user_role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, User, Role])],
  controllers:[UserRoleController],
  providers: [UserRoleService],
  exports: [UserRoleService], 
})
export class UserRoleModule {}
