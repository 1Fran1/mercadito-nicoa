import { Module, OnModuleInit } from '@nestjs/common'; // Agregar OnModuleInit para ejecutar código en el inicio del módulo
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Role } from './roles/entities/role.entity'; // Importar la entidad Role
import { SeedService } from './seeders/seed.service';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
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
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
      }),
    }),

    // Registrar el repositorio de la entidad Role para usarlo en SeedService
    TypeOrmModule.forFeature([Role]),

    // Configuración global del JWT
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),

    // Módulos de la aplicación
    AuthModule,
    ProductModule,
    CategoryModule,
    EntrepreneurModule,
    UsersModule,
    UserRoleModule,
    RolesModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService], // Agregar el SeedService a los providers
})
export class AppModule implements OnModuleInit { // Implementar OnModuleInit para ejecutar el seed
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    // Ejecutar la semilla de roles cuando se inicializa el módulo
    await this.seedService.seedRoles();
  }
}
