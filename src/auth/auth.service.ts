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

  // Registro de usuario
  async register(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return {
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  // Inicio de sesión
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Encuentra el usuario por email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Crea el payload del JWT incluyendo el rol directamente
    const payload = {
      email: user.email,
      userId: user.id,
      role: user.role,
      status: user.status, 
    };

    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d', // Duración del token
      });

      return {
        token,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate JWT');
    }
  }
}
