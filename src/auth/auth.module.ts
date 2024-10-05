import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserRoleModule } from '../user_role/user_role.module'; // Asegúrate de importar UserRoleModule
import { UsersModule } from '../users/users.module'; // Importa también el módulo de usuarios

@Module({
  imports: [
    UsersModule,
    PassportModule,
    UserRoleModule, // Asegúrate de importar correctamente este módulo
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
