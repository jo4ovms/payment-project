import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Payment API')
    .setDescription('API RESTful para gestão de vendas, clientes e produtos')
    .setVersion('1.0')
    .addTag('clientes')
    .addTag('produtos')
    .addTag('condpagto')
    .addTag('precos')
    .addTag('relatorios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('Swagger UI disponível em http://localhost:3000/api');

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicação executando na porta ${process.env.PORT ?? 3000}`);
}
bootstrap();
