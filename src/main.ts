import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);




  const config = new DocumentBuilder()
  .setTitle('Mercadito Nicoa')
  .setDescription('Mercadito Nicoa API description')
  .setVersion('1.0')
  .addTag('mercadito')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    explorer:true,
    swaggerOptions:{
      filter:true,
      showRequestDuration:true,
    }
  });
  

  await app.listen(3000);
}
bootstrap();
