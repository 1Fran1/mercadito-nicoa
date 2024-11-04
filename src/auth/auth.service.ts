import { 
  BadRequestException, 
  Injectable, 
  UnauthorizedException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // Registro y envío de correo de activación
  async register(registerDto: RegisterDto) {
    

    try {
      const existingUser = await this.usersService.findOneByEmail(registerDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      // Encriptar contraseña y crear usuario
      const newUser = await this.usersService.create({
        ...registerDto,
        password: await bcrypt.hash(registerDto.password, 10),
      });

      const activationToken = await this.jwtService.signAsync(
        { email: newUser.email },
        { secret: process.env.JWT_SECRET, expiresIn: '24h' },
      );

      const activationUrl = `${process.env.FRONTEND_URL}/auth/activate?token=${activationToken}`;

      // Cargar y adaptar plantilla de correo
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

  // Activación de cuenta
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

      user.status = 1; // Activa la cuenta
      await this.usersService.update(user.id, user);

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
      console.log("Respuesta de reCAPTCHA:", data);
  
      if (!data.success) {
        console.error("Error en la respuesta de reCAPTCHA:", data["error-codes"]);
        throw new BadRequestException('Falló la validación de reCAPTCHA');
      }
    } catch (error) {
      console.error("Error en la validación de reCAPTCHA:", error);
      throw new BadRequestException('Error validando reCAPTCHA');
    }
  }



  async login(loginDto: LoginDto, recaptchaToken: string) {
    // Valida el reCAPTCHA
    try {
      await this.validateRecaptcha(recaptchaToken);
   
    } catch (error) {
      console.error("Error en la validación de reCAPTCHA:", error);
      throw new BadRequestException('Falló la validación de reCAPTCHA');
    }
  
    const { email, password } = loginDto;
   
  
    // Busca el usuario por email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      console.log("Usuario no encontrado para el email:", email);
      throw new UnauthorizedException('Invalid email or password');
    } else {
      console.log("Usuario encontrado:", user);
    }
  
    // Verifica la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Contraseña inválida para el usuario:", email);
      throw new UnauthorizedException('Invalid email or password');
    } else {
      console.log("Contraseña válida para el usuario:", email);
    }
  
    // Crea el payload del JWT
    const payload = {
      email: user.email,
      userId: user.id,
      role: user.role,
      status: user.status,
    };
  
    // Genera el token JWT
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
      throw new InternalServerErrorException('Failed to generate JWT');
    }
  }
}
