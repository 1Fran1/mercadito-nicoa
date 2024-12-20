import { Transform } from "class-transformer";
import { IsString, IsEmail, MinLength, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @Transform(({ value}) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    recaptchaToken: string;
}