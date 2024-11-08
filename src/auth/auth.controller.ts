import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro de usuario
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to register user');
    }
  }

  // Activar cuenta de usuario
  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activateAccount(@Body('token') token: string) {
    try {
      const user = await this.authService.activateUser(token);
      return { message: user.message };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  // Inicio de sesión con reCAPTCHA
 // Inicio de sesión
 @Post('login')
 @HttpCode(HttpStatus.OK)
 async login(
   @Body() loginDto: LoginDto, 
   @Body('recaptchaToken') recaptchaToken: string // Recibe el token de reCAPTCHA desde el frontend
 ) {
   try {
     // Pasa el `recaptchaToken` al servicio para validarlo antes de continuar
     const result = await this.authService.login(loginDto, recaptchaToken);
     return {
       token: result.token,
       email: result.email,
       role: result.role,
       status: result.status,
     };
   } catch (error) {
     throw new BadRequestException('Invalid email or password');
   }
 }
}
