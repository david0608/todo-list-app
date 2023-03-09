import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TodoItemService } from './todo-item.service';
import { ListTodoItemDto, CreateTodoItemDto, UpdateTodoItemDto } from './dto';
import { TodoItem } from '../../typeorm/todo-item.entity';

@ApiTags('Todo item')
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
@Controller('todo_item')
export class TodoItemController {
  constructor(private readonly todoItemService: TodoItemService) {}

  @ApiOperation({ summary: 'Get a todo item by id.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Todo item found.',
    type: TodoItem,
  })
  @ApiNotFoundResponse({
    description: 'Todo item not found.',
  })
  @Get(':id')
  async getOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.todoItemService.getOneById(id).then((item) => {
      if (!item) {
        throw new NotFoundException();
      } else {
        return item;
      }
    });
  }

  @ApiOperation({ summary: 'List todo items.' })
  @ApiOkResponse({
    description: 'Todo items listed.',
    type: TodoItem,
    isArray: true,
  })
  @Get()
  async list(@Query() query: ListTodoItemDto) {
    return this.todoItemService.list(query);
  }

  @ApiOperation({ summary: 'Create a todo item.' })
  @ApiCreatedResponse({
    description: 'Successfully created.',
    type: TodoItem,
  })
  @Post()
  async create(@Body() createTodoItemDto: CreateTodoItemDto) {
    return this.todoItemService.createOne(createTodoItemDto);
  }

  @ApiOperation({ summary: 'Update a todo item by id.' })
  @ApiOkResponse({ description: 'Succfully updated.' })
  @ApiNotFoundResponse({
    description: 'Todo item not found.',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    return this.todoItemService
      .updateOnebyId(id, updateTodoItemDto)
      .then((updated) => {
        if (!updated) {
          throw new NotFoundException();
        }
      });
  }

  @ApiOperation({ summary: 'Delete a todo item by id.' })
  @ApiOkResponse({ description: 'Succfully deleted.' })
  @ApiNotFoundResponse({
    description: 'Todo item not found.',
  })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.todoItemService.deleteOneById(id).then((deleted) => {
      if (!deleted) {
        throw new NotFoundException();
      }
    });
  }
}
