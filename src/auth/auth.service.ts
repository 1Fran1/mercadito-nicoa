import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  // Registro de usuario
  async register(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);

      // Genera el token de activación con un tiempo de expiración de 24 horas
      const activationToken = await this.jwtService.signAsync(
        { email: newUser.email },
        { secret: process.env.JWT_SECRET, expiresIn: '24h' },
      );

      // Generar el enlace de activación
      const activationUrl = `${process.env.FRONTEND_URL}/auth/activate?token=${activationToken}`;

      // Cargar la plantilla HTML desde el archivo
      let emailTemplate = readFileSync(
        join(process.cwd(), 'src', 'mailer', 'templates', 'activation-email.html'),
        'utf8'
      );

      // Reemplazar los placeholders {{name}} y {{activationUrl}} en la plantilla HTML
      emailTemplate = emailTemplate
        .replace('{{name}}', newUser.name)
        .replace('{{activationUrl}}', activationUrl);

      // Enviar el correo con el contenido HTML
      await this.mailerService.sendMail({
        to: newUser.email,
        subject: 'Confirma tu cuenta',
        html: emailTemplate, // Usar la plantilla modificada
      });

      return {
        message:
          'User registered successfully. Please check your email to activate your account.',
        user: newUser,
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new InternalServerErrorException(
        'An error occurred while registering the user',
      );
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
        expiresIn: '1d',
      });

      return {
        token,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      console.error('Error al generar JWT:', error);
      throw new InternalServerErrorException('Failed to generate JWT');
    }
  }
}
