import { BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // Llamamos al método create del UsersService
      const newUser = await this.usersService.create(createUserDto);

      // Retornamos un mensaje de éxito y el nuevo usuario creado
      return {
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      // Si hay algún error, capturamos y lanzamos una excepción interna del servidor
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }


async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  // Encuentra el usuario por email
  const user = await this.usersService.findOneByEmail(email);
  if (!user) {
    console.log('Usuario no encontrado');
    throw new UnauthorizedException('Invalid email or password');
  }

  console.log('Usuario encontrado:', user);

  // Verifica la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('Contraseña ingresada:', password);
  console.log('Contraseña almacenada (hash):', user.password);
  console.log('¿Es la contraseña válida?:', isPasswordValid);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

  // Crea el payload del JWT
  const payload = {
    email: user.email,
  };

  try {
    // Firma el JWT
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });

    return {
      token,
      email: user.email,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to generate JWT');
  }
}

}
