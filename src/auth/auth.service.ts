import { 
  BadRequestException, 
  Injectable, 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findOneByEmail(registerDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const newUser = await this.usersService.create({
        ...registerDto,
        password: await bcrypt.hash(registerDto.password, 10),
      });

      const activationToken = await this.jwtService.signAsync(
        { email: newUser.email },
        { secret: process.env.JWT_SECRET, expiresIn: '24h' },
      );

      const activationUrl = `${process.env.FRONTEND_URL}/auth/activate?token=${activationToken}`;

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

      if (user.status === 1) {
        return { message: 'La cuenta ya está activada' };
      }

      user.status = 1;
      await this.userRepository.save(user); // Solo guarda el cambio de estado sin sobrescribir otros datos

      return { message: 'Cuenta activada con éxito' };
    } catch (error) {
      throw new InternalServerErrorException('Token inválido o expirado');
    }
  }

  async validateRecaptcha(recaptchaToken: string): Promise<void> {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
  
    try {
      const { data } = await axios.post(url);
      console.log("Resultado de reCAPTCHA:", data);
  
      if (!data.success) {
        console.error("Error en reCAPTCHA:", data["error-codes"]);
        throw new BadRequestException('Validación de reCAPTCHA fallida');
      }
    } catch (error) {
      console.error("Error en reCAPTCHA:", error);
      throw new BadRequestException('Error validando reCAPTCHA');
    }
  }

  async login(loginDto: LoginDto, recaptchaToken: string) {
    try {
      await this.validateRecaptcha(recaptchaToken);
    } catch (error) {
      console.error("Error en reCAPTCHA:", error);
      throw new BadRequestException('Validación de reCAPTCHA fallida');
    }

    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.log("Usuario no encontrado para el email:", email);
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    } else {
      console.log("Usuario encontrado:", user);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Contraseña incorrecta para el usuario:", email);
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    } else {
      console.log("Contraseña válida para el usuario:", email);
    }

    const payload = {
      email: user.email,
      userId: user.id,
      role: user.role,
      status: user.status,
    };

    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      return {
        token,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    } catch (error) {
      console.error("Error al generar JWT para el usuario:", user.email, error);
      throw new InternalServerErrorException('No se pudo generar el token JWT');
    }
  }
}
