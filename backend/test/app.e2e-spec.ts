import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import { pipe } from 'fp-ts/function';
import { Ordering } from 'fp-ts/lib/Ordering';
import * as B from 'fp-ts/boolean';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as N from 'fp-ts/number';
import * as D from 'fp-ts/Date';
import { AppModule } from '../src/modules/app.module';
import { ResponseInterceptor } from '../src/interceptors';
import { countDownGenerator } from '../src/common/utils';
import { CreateTodoItemDto } from '../src/modules/todo-item/dto';
import { TodoItem, ordTodoItemByTitle } from '../src/typeorm';
import { Priority } from '../src/common/types/priority';

const stringOver64Chars =
  'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij';

const e2eTestTodoItemPrefix = 'e2e_test_todo_item';

const badRequestResBody = expect.objectContaining({
  statusCode: 400,
  error: 'Bad Request',
});
const notFoundResBody = { statusCode: 404, message: 'Not Found' };

type TestRequest = supertest.SuperTest<supertest.Test>;

describe('Application (e2e)', () => {
  let app: INestApplication;
  let request: TestRequest;

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
        mockTodoItems = A.sort(ordTodoItemByTitle)(created.right as TodoItem[]);
      }
    });

    // Delete all mock todo item data after all tests completed.
    afterAll(async () => {
      const deleted = await todoItemDataDeleter(request)(mockTodoItems)();
      if (E.isLeft(deleted)) {
        throw deleted.left;
      }
    });

    // Test GET /todo_item/:id success reqponse.
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

    // Test GET /todo_item/:id bad request error response caused by invalid id.
    describe('GET /todo_item/:id with invalid id.', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.get(`/todo_item/1`);
      });

      it('should respond with status 400.', () =>
        expect(res.statusCode).toEqual(400));
      it('should respond with bad request error.', () =>
        expect(res.body).toEqual(badRequestResBody));
    });

    // Test GET /todo_item/:id not found response.
    describe('GET /todo_item/:id with not existed id.', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        const id = await getNotExistsId(request);
        res = await request.get(`/todo_item/${id}`);
      });

      it('should respond with status 404.', () =>
        expect(res.statusCode).toEqual(404));
      it('should respond with not found error.', () =>
        expect(res.body).toEqual(notFoundResBody));
    });

    // Test GET /todo_item success response.
    describe('GET /todo_item', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.get(`/todo_item?search=${e2eTestTodoItemPrefix}`);
      });

      it('should respond with status 200.', () =>
        expect(res.statusCode).toEqual(200));
      it('should respond with expected body.', () => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.data.length).toEqual(10);
        expect(A.sort(ordTodoItemByTitle)(res.body.data)).toEqual(
          mockTodoItems,
        );
      });
    });

    // Test GET /todo_item with search success response.
    describe('GET /todo_item with search', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.get(
          `/todo_item?search=${e2eTestTodoItemPrefix}_title_10`,
        );
      });

      it('should respond with status 200.', () =>
        expect(res.statusCode).toEqual(200));
      it('should respond with expected body.', () => {
        expect(res.body.statusCode).toEqual(200);
        expect(res.body.data.length).toEqual(1);
      });
    });

    // Test GET /todo_item with priority filter success response.
    describe('GET /todo_item with priority filter', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.get(
          `/todo_item?search=${e2eTestTodoItemPrefix}&priority=1,2`,
        );
      });

      it('should respond with status 200.', () => {
        expect(res.statusCode).toBe(200);
      });
      it('should respond data with expected priority.', () => {
        let tested = false;
        for (const item of res.body.data) {
          expect([1, 2]).toContain(item.priority);
          tested = true;
        }
        expect(tested).toBe(true);
      });
    });

    // Test GET /todo_item with done status filter success response.
    describe('GET /todo_item with done status filter', () => {
      let doneRes: supertest.Response;
      let nonDoneRes: supertest.Response;

      beforeAll(async () => {
        doneRes = await request.get(
          `/todo_item?search=${e2eTestTodoItemPrefix}&done=true`,
        );
        nonDoneRes = await request.get(
          `/todo_item?search=${e2eTestTodoItemPrefix}&done=false`,
        );
      });

      it('should respond with status 200.', () => {
        expect(doneRes.statusCode).toBe(200);
        expect(nonDoneRes.statusCode).toBe(200);
      });
      it('should respond data with expected done status.', () => {
        let tested = false;
        for (const item of doneRes.body.data) {
          expect(item.done).toBe(true);
          tested = true;
        }
        for (const item of nonDoneRes.body.data) {
          expect(item.done).toBe(false);
          tested = true;
        }
        expect(tested).toBe(true);
      });
    });

    // Test GET /todo_item with sort success response.
    describe('GET /todo_item with sort', () => {
      type Cmp = (f: TodoItem, s: TodoItem) => Ordering;
      type TD = { key: string; cmp: Cmp };

      const sortRequest = (key: string, reverse: boolean) =>
        request.get(
          `/todo_item?search=${e2eTestTodoItemPrefix}&sortKey=${key}&reverse=${reverse}`,
        );

      const testFunction = async (td: TD, reverse: boolean) => {
        let tested = false;
        const res = await sortRequest(td.key, reverse);
        expect(res.statusCode).toBe(200);
        const items = res.body.data;
        for (let i = 0; i < items.length - 1; i++) {
          expect(reverse ? [-1, 0] : [0, 1]).toContain(
            td.cmp(items[i], items[i + 1]),
          );
          tested = true;
        }
        expect(tested).toBe(true);
      };

      it('should respond with status 200 and expected data order.', async () => {
        const testData: TD[] = [
          {
            key: 'priority',
            cmp: (f, s) => N.Ord.compare(f.priority, s.priority),
          },
          {
            key: 'created_at',
            cmp: (f, s) =>
              D.Ord.compare(new Date(f.created_at), new Date(s.created_at)),
          },
          {
            key: 'updated_at',
            cmp: (f, s) =>
              D.Ord.compare(new Date(f.updated_at), new Date(s.updated_at)),
          },
        ];
        const test = pipe(
          testData,
          T.traverseSeqArray((td: TD) => async () => {
            await testFunction(td, true);
            await testFunction(td, false);
          }),
        );
        await test();
      });
    });

    // Test GET /todo_item bad request response caused by invalid query parameter.
    describe('GET /todo_item with invalid query parameter', () => {
      const testFunction = async (qs: string) => {
        const res = await request.get(`/todo_item?${qs}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(badRequestResBody);
      };

      it('should respond with status 400 and expected error.', async () => {
        const testData = [
          `search=${stringOver64Chars}`, // over 64 chars.
          'priority=4', // invalid priority.
          'priority=a', // invalid priority.
          'priority=1,2,3,4', // invalid priority.
          'priority=1,2,', // invalid format.
          'done=yes', // invalid boolean.
          'sortKey=title', // invalid key.
          'reverse=no', // invalid boolean.
        ];
        const test = pipe(
          testData,
          T.traverseSeqArray((td) => () => testFunction(td)),
        );
        await test();
      });
    });

    // Test POST /todo_item success response.
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

    // Test POST /todo_item bad request response caused by invalid data.
    describe('POST /todo_item with invalid data provided', () => {
      const testFunction = async (td: Record<string, any>) => {
        const res = await request.post('/todo_item').send(td);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(badRequestResBody);
      };

      it('should respond with status 400 and bad request error.', async () => {
        const data = [
          { priority: 1 }, // Title not provided.
          { title: 'title' }, // Priority not provided.
          { title: 123, priority: 1 }, // Invalid title data.
          { title: true, priority: 1 }, // Invalid title data.
          { title: '', priority: 1 }, // Invalid title data.
          { title: 'title', priority: 4 }, // Invalid priority data.
          { title: 'title', priority: true }, // Invalid priority data.
          { title: 'title', priority: '' }, // Invalid priority data.
        ];
        const test = pipe(
          data,
          T.traverseSeqArray((td) => () => testFunction(td)),
        );
        await test();
      });
    });

    // Test PATCH /todo_item/:id success response.
    describe('PATCH /todo_item/:id', () => {
      const testFunction = async (data: Record<string, any>) => {
        const url = `/todo_item/${mockTodoItems[0].id}`;
        const patchRes = await request.patch(url).send(data);
        const getRes = await request.get(url);
        expect(patchRes.statusCode).toEqual(200);
        for (const key of Object.keys(data)) {
          expect(getRes.body.data[key]).toEqual(data[key]);
        }
      };

      it('should respond with status 200 and successfully update todo item.', async () => {
        const testData = [
          {
            title: 'patched',
            detail: 'patched',
            priority: 3,
            done: true,
          },
          {},
        ];
        const test = pipe(
          testData,
          T.traverseSeqArray((td) => () => testFunction(td)),
        );
        await test();
      });
    });

    // Test PATCH /todo_item/:id bad request error response caudes by invalid id.
    describe('PATCH /todo_item/:id with invalid id.', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.patch(`/todo_item/1`).send({ title: 'patched' });
      });

      it('should respond with status 400.', () =>
        expect(res.statusCode).toEqual(400));
      it('should respond with bad request error.', () =>
        expect(res.body).toEqual(badRequestResBody));
    });

    // Test PATCH /todo_item/:id bad request response caused by invalid data.
    describe('PATCH /todo_item/:id with invalid data provided', () => {
      const testFunction = async (td: Record<string, any>) => {
        const res = await request
          .patch(`/todo_item/${mockTodoItems[0].id}`)
          .send(td);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(badRequestResBody);
      };

      it('should respond with status 400 and bad request error.', async () => {
        const data = [
          { priority: 4 }, // Invalid priority data.
          { priority: true }, // Invalid priority data.
          { title: 123 }, // Invalid title data.
          { title: true }, // Invalid title data.
          { detail: 123 }, // Invalid detail data.
          { detail: true }, // Invalid detail data.
          { done: 'yes' }, // Invalid done data.
          { done: 1 }, // Invalid done data.
        ];
        const test = pipe(
          data,
          T.traverseSeqArray((td) => () => testFunction(td)),
        );
        await test();
      });
    });

    // Test PATCH /todo_item/:id not found response.
    describe('PATCH /todo_item/:id with not existed id.', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        const id = await getNotExistsId(request);
        res = await request
          .patch(`/todo_item/${id}`)
          .send({ title: 'patched' });
      });

      it('should respond with status 404.', () =>
        expect(res.statusCode).toEqual(404));
      it('should respond with not found error.', () =>
        expect(res.body).toEqual(notFoundResBody));
    });

    // Test DELETE /todo_item/:id success response.
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

    // Test DELETE /todo_item/:id bad request error response caused by invalid id.
    describe('DELETE /todo_item/:id with invalid id.', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        res = await request.delete(`/todo_item/1`);
      });

      it('should respond with status 400.', () =>
        expect(res.statusCode).toEqual(400));
      it('should respond with bad request error.', () =>
        expect(res.body).toEqual(badRequestResBody));
    });

    // Test DELETE /todo_item/:id not found response.
    describe('DELETE /todo_item/:id with not existed id.', () => {
      let res: supertest.Response;

      beforeAll(async () => {
        const id = await getNotExistsId(request);
        res = await request.delete(`/todo_item/${id}`);
      });

      it('should respond with status 404.', () =>
        expect(res.statusCode).toEqual(404));
      it('should respond with not found error.', () =>
        expect(res.body).toEqual(notFoundResBody));
    });
  });
});

const mockTodoItemDataCreator = (request: TestRequest) =>
  pipe(
    generateCreateTodoItemDtos(10),
    TE.traverseSeqArray(todoItemCreateRequest(request)),
  );

const todoItemDataDeleter =
  (request: TestRequest) => (items: readonly TodoItem[]) =>
    pipe(
      items.map((item) => item.id),
      TE.traverseSeqArray(todoItemDeleteRequest(request)),
    );

const todoItemCreateRequest =
  (request: TestRequest) => (data: CreateTodoItemDto) =>
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

const todoItemDeleteRequest = (request: TestRequest) => (id: string) =>
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
    title: `${e2eTestTodoItemPrefix}_title_${n}`,
    detail: `${e2eTestTodoItemPrefix}_detail_${n}`,
    priority: ((n % 3) + 1) as Priority,
  };
}

async function getNotExistsId(request: TestRequest): Promise<string> {
  const res = await request
    .post('/todo_item')
    .send({ title: 't', priority: 1 });
  const id = res.body.data.id;
  await request.delete(`/todo_item/${id}`);
  return id;
}
