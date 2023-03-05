import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { pipe } from 'fp-ts/function';
import * as B from 'fp-ts/boolean';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { AppModule } from '../src/modules/app.module';
import { ResponseInterceptor } from '../src/interceptors';
import { countDownGenerator } from '../src/common/utils';
import { CreateTodoItemDto } from '../src/modules/todo-item/dto';
import { TodoItem } from '../src/typeorm';
import { Priority } from '../src/common/types/priority';

type Request = supertest.SuperTest<supertest.Test>;

describe('Application (e2e)', () => {
  let app: INestApplication;
  let request: Request;

  // Initialize application instance.
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();

    request = supertest(app.getHttpServer());
  });

  // Clear application instance.
  afterAll(async () => {
    await app.close();
  });

  // Test app module.
  describe('app module', () => {
    describe('GET /', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.get('/');
      });

      it('should respond with status 200.', () =>
        expect(res.statusCode).toEqual(200));
      it('should respond with expected body.', () =>
        expect(res.body).toEqual({ statusCode: 200, data: 'Hello World!' }));
    });
  });

  // Test todo_item module.
  describe('todo_item module', () => {
    // Mock todo item data created for testing.
    let mockTodoItems: readonly TodoItem[] = [];

    // Create mock todo item data before all tests start.
    beforeAll(async () => {
      const created = await mockTodoItemDataCreator(request)();
      if (E.isLeft(created)) {
        throw created.left;
      } else {
        mockTodoItems = created.right;
      }
    });

    // Delete all mock todo item data after all tests completed.
    afterAll(async () => {
      const deleted = await todoItemDataDeleter(request)(mockTodoItems)();
      if (E.isLeft(deleted)) {
        throw deleted.left;
      }
    });

    describe('GET /todo_item/:id', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.get(`/todo_item/${mockTodoItems[0].id}`);
      });

      it('should respond with status 200.', () =>
        expect(res.statusCode).toEqual(200));
      it('should respond with expected body.', () =>
        expect(res.body).toEqual({ statusCode: 200, data: mockTodoItems[0] }));
    });

    describe('POST /todo_item', () => {
      let postRes: supertest.Response;
      let getRes: supertest.Response;
      const postData = createTodoItemDto();

      beforeAll(async () => {
        postRes = await request.post('/todo_item').send(postData);
        getRes = await request.get(`/todo_item/${postRes.body.data.id}`);
      });

      afterAll(async () => {
        await request.delete(`/todo_item/${postRes.body.data.id}`);
      });

      it('should respond with status 201.', () =>
        expect(postRes.statusCode).toEqual(201));
      it('should successfully create todo item.', () => {
        expect(getRes.body.data.title).toEqual(postData.title);
        expect(getRes.body.data.detail).toEqual(postData.detail);
        expect(getRes.body.data.priority).toEqual(postData.priority);
      });
    });

    describe('PATCH /todo_item/:id', () => {
      let patchRes: supertest.Response;
      let getRes: supertest.Response;
      const patchData = {
        title: 'patched',
        detail: 'patched',
        priority: 3,
        done: true,
      };

      beforeAll(async () => {
        const url = `/todo_item/${mockTodoItems[0].id}`;
        patchRes = await request.patch(url).send(patchData);
        getRes = await request.get(url);
      });

      it('should respond with status 200.', () =>
        expect(patchRes.statusCode).toEqual(200));
      it('should successfully update todo item.', () => {
        expect(getRes.body.data.title).toEqual(patchData.title);
        expect(getRes.body.data.detail).toEqual(patchData.detail);
        expect(getRes.body.data.priority).toEqual(patchData.priority);
        expect(getRes.body.data.done).toEqual(patchData.done);
      });
    });

    describe('DELETE /todo_item/:id', () => {
      let deleteRes: supertest.Response;
      let getRes: supertest.Response;

      beforeAll(async () => {
        const url = `/todo_item/${mockTodoItems[0].id}`;
        deleteRes = await request.delete(url);
        getRes = await request.get(url);
      });

      it('should respond with status 200.', () =>
        expect(deleteRes.statusCode).toEqual(200));
      it('should successfully delete todo item.', () =>
        expect(getRes.statusCode).toEqual(404));
    });
  });
});

const mockTodoItemDataCreator = (request: Request) =>
  pipe(
    generateCreateTodoItemDtos(10),
    TE.traverseSeqArray(todoItemCreateRequest(request)),
  );

const todoItemDataDeleter =
  (request: Request) => (items: readonly TodoItem[]) =>
    pipe(
      items.map((item) => item.id),
      TE.traverseSeqArray(todoItemDeleteRequest(request)),
    );

const todoItemCreateRequest = (request: Request) => (data: CreateTodoItemDto) =>
  TE.tryCatch(
    pipe(
      () => request.post('/todo_item').send(data),
      T.map((res) =>
        pipe(
          res.statusCode === 201,
          B.match(
            () => {
              throw `POST to /todo_item failed with status: ${res.statusCode}`;
            },
            () => res.body.data as TodoItem,
          ),
        ),
      ),
    ),
    (reason) => new Error(`${reason}`),
  );

const todoItemDeleteRequest = (request: Request) => (id: string) =>
  TE.tryCatch(
    () => request.delete(`/todo_item/${id}`),
    (reason) => new Error(`${reason}`),
  );

// Testing CreateTodoItemDto objects generator.
function generateCreateTodoItemDtos(n: number): CreateTodoItemDto[] {
  return pipe(createTodoItemDto, (c) =>
    A.unfold(n, countDownGenerator(c)).reverse(),
  );
}

// Testing CreateTodoItemDto object creation function.
function createTodoItemDto(n = 0): CreateTodoItemDto {
  return {
    title: `e2e_test_todo_item_title_${n}`,
    detail: `e2e_test_todo_item_detail_${n}`,
    priority: ((n % 3) + 1) as Priority,
  };
}
