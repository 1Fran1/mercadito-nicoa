import { BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync } from 'fs';
import { join } from 'path';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async register(createUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);

      const activationToken = await this.jwtService.signAsync(
        { email: newUser.email },
        { secret: process.env.JWT_SECRET, expiresIn: '24h' },
      );

      const activationUrl = `${process.env.FRONTEND_URL}/auth/activate?token=${activationToken}`;

      // Cambia la ruta al archivo HTML para usar `process.cwd()` que siempre apunta al directorio raíz
      let emailTemplate = readFileSync(
        join(process.cwd(), 'src', 'mailer', 'templates', 'activation-email.html'),
        'utf8'
      );

      emailTemplate = emailTemplate
        .replace('{{name}}', newUser.name)
        .replace('{{activationUrl}}', activationUrl);

      await this.mailerService.sendMail({
        to: newUser.email,
        subject: 'Confirma tu cuenta',
        html: emailTemplate,
      });

      return {
        message: 'User registered successfully. Please check your email to activate your account.',
        user: newUser,
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  // Activar usuario
  async activateUser(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const email = decodedToken.email;
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      // Verifica si la cuenta ya está activada
      if (user.status === 1) {
        return { message: 'La cuenta ya está activada' }; // Aquí retornamos el mensaje
      }

      // Si la cuenta no está activada, procede a activarla
      user.status = 1; // Cambia el estado a 1 (activo)
      await this.usersService.update(user.id, user);

      return { message: 'Cuenta activada con éxito' };
    } catch (error) {
      throw new InternalServerErrorException('Token inválido o expirado');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
  
    console.log("Intentando iniciar sesión con el email:", email);
  
    // Encuentra el usuario por email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.log("Usuario no encontrado para el email:", email);
      throw new UnauthorizedException('Invalid email or password');
    } else {
      console.log("Usuario encontrado:", user);
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
  
      console.log("JWT generado exitosamente para el usuario:", user.email);
  
      return {
        token,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      console.error("Error al generar JWT para el usuario:", user.email, error);
      throw new InternalServerErrorException('Failed to generate JWT');
    }
  }
}