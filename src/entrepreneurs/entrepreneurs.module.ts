import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { EntrepreneurService } from './entrepreneurs.service';
import { EntrepreneurController } from './entrepreneurs.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Entrepreneur])],
  providers: [EntrepreneurService],
  controllers: [EntrepreneurController],
  exports: [EntrepreneurService], // Exportamos el servicio si se necesita en otros módulos
})
export class EntrepreneurModule {}
