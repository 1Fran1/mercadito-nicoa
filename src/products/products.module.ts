import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductController } from './products.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
  exports: [ProductService], 
  controllers: [ProductController], 
})
export class ProductModule {}
