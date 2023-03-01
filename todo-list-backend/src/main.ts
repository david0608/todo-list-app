import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const docConfig = new DocumentBuilder()
    .setTitle('Todo list')
    .setDescription('The todo list api description.')
    .setVersion('1.0')
    .addTag('todo')
    .build();

  SwaggerModule.setup(
    'doc/api',
    app,
    SwaggerModule.createDocument(app, docConfig),
  );

  await app.listen(8000);
}
bootstrap();
