import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Usar ConfigModule para manejar variables de entorno
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/products.module';
import { CategoryModule } from './categories/categories.module';
import { EntrepreneurModule } from './entrepreneurs/entrepreneurs.module';
import { UsersModule } from './users/users.module';
import { UserRoleModule } from './user_role/user_role.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hacer las variables de entorno globales para todos los módulos
      envFilePath: ['.env'], // Ruta al archivo de configuración .env
    }),

    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{js,ts}')],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // Manejar sincronización con variable de entorno
      }),
    }),

    // Configuración global del JWT
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, // Usar la variable de entorno para el secreto
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // Configurar la expiración con variable de entorno
    }),

    // Módulos de la aplicación
    AuthModule,
    ProductModule,
    CategoryModule,
    EntrepreneurModule,
    UsersModule,
    UserRoleModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
