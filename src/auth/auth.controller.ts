import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger'; // Para documentación con Swagger (opcional)
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('auth') // Para agregar etiquetas en Swagger, opcional
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  // Registro de usuario
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return {
      message: result.message,
      user: result.user,
    };
  }

 // Activar cuenta de usuario
 @Post('activate')
 @HttpCode(HttpStatus.OK)
 async activateAccount(@Body('token') token: string) {
   try {
     const decoded = await this.jwtService.verifyAsync(token, {
       secret: process.env.JWT_SECRET,
     });

     const user = await this.authService.activateUser(token);
     return { message: user.message };
   } catch (error) {
     throw new BadRequestException('Invalid or expired token');
   }
 }


  // Inicio de sesión
  @Post('login')
  @HttpCode(HttpStatus.OK) // Establece el código de estado HTTP 200
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      token: result.token,
      email: result.email,
    };
  }
}
