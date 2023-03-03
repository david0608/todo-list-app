import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { ResponseInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  const docConfig = new DocumentBuilder()
    .setTitle('Todo list')
    .setDescription('The todo list api description.')
    .setVersion('1.0')
    .addTag('Todo item', 'Todo item operations.')
    .build();

  SwaggerModule.setup(
    'doc/api',
    app,
    SwaggerModule.createDocument(app, docConfig),
  );

  await app.listen(8000);
}
bootstrap();
