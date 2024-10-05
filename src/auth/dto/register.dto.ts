import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class RegisterDto {
    @Transform(({ value }) => value.trim())
    @IsString({ message: 'Name must be a string' })
    @MinLength(1, { message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @Transform(({ value }) => value.trim())
    @IsString({ message: 'Address must be a string' })
    @MinLength(1, { message: 'Address is required' })
    address: string;

    @IsString({ message: 'Phone must be a string' })
    @MinLength(7, { message: 'Phone number is too short' })
    @MaxLength(15, { message: 'Phone number is too long' })
    phone: string;

    @Transform(({ value }) => value.trim())
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
