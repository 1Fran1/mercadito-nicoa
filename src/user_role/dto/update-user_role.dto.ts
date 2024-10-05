import { IsInt, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsInt({ message: 'User ID must be an integer' })
  @IsOptional()
  userId?: number;

  @IsInt({ message: 'Role ID must be an integer' })
  @IsOptional()
  roleId?: number;
}
