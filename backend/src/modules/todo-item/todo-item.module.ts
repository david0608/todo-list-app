import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoItemController } from './todo-item.controller';
import { TodoItemService } from './todo-item.service';
import { TodoItem } from '../../typeorm/todo-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem])],
  controllers: [TodoItemController],
  providers: [TodoItemService],
})
export class TodoItemModule {}
