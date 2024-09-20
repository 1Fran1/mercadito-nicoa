import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/products.module';
import { CategoryModule } from './categories/categories.module';
import { EntrepreneurModule } from './entrepreneurs/entrepreneurs.module';


config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '**', '*.entity.{js,ts}')],
      synchronize: true, // Solo para desarrollo, evita usar en producción
    }),
    ProductModule,
    CategoryModule,
    EntrepreneurModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
