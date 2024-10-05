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

    // Encuentra el usuario por email e incluye los roles
    const user = await this.usersService.findOneByEmailWithRoles(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Crea el payload del JWT incluyendo los roles
    const payload = {
      email: user.email,
      userId: user.id,
      userRoles: user.userRoles.map(role => ({
        roleId: role.role.id,
        roleName: role.role.name,
      })),
    };

    try {
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
