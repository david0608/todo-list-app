import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoItemModule } from './todo-item/todo-item.module';
import entities from '../typeorm';
import * as typeormConfig from '../typeorm.config.json';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeormConfig,
      entities: entities,
    } as TypeOrmModuleOptions),
    TodoItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
