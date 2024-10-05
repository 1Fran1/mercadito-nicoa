import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger'; // Para documentación con Swagger (opcional)

@Controller('auth')
@ApiTags('auth') // Para agregar etiquetas en Swagger, opcional
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro de usuario
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Establece el código de estado HTTP 201
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return {
      message: result.message,
      user: result.user,
    };
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
