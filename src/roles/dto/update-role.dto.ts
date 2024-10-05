import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsString({ message: 'Role name must be a string' })
  @MinLength(1, { message: 'Role name is required' })
  @MaxLength(100, { message: 'Role name is too long' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description is too long' })
  @IsOptional()
  description?: string;
}
