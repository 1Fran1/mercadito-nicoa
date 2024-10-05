import { IsInt } from 'class-validator';

export class CreateUserRoleDto {
  @IsInt({ message: 'User ID must be an integer' })
  userId: number;

  @IsInt({ message: 'Role ID must be an integer' })
  roleId: number;
}
