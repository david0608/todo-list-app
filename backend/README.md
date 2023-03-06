# Todo list app backend

## Prerequisites

### Install tools

You should have following tools installed on your host.  

1. **NodeJS** (v16.19.1 is recommended.)
2. **npm** (v8.19.3 is recommended.)

You can use **nvm** to install and manage the NodeJS version on your host. After installed NodeJS using nvm the npm will also be installed.  
Please refer to the [NVM project description](https://github.com/nvm-sh/nvm).  

### Run todo-list-app postgres

Before you can play with todo-list-app backend you should have todo-list-app postgres running on your host.  
Please refer to [todo-list-app postgres project](https://github.com/david0608/todo-list-app/tree/master/postgres).  

## Get started

### Install node project dependencies

Run following command under the todo-list-app/backend directory.  

```
$ npm install
```

### Run backend server

After successfully installed dependencies, run following command to start backend server.

```
$ npm start
npm run start
todo-list-backend@0.0.1 start
nest start
...
[Nest] 2222  - 2023/03/06 下午10:23:54     LOG [NestApplication] Nest application successfully started +2ms
```

## OpenAPI specification

### Swagger UI

With todo-list-app backend running on your host, you can enter [http://127.0.0.1:8000/doc/api](http://127.0.0.1:8000/doc/api) in your browser to visit Swagger UI for API details.  

### OpenAPI.json

Or you can visit [http://127.0.0.1:8000/doc/api-json](http://127.0.0.1:8000/doc/api-json) to fetch API spec on JSON format.

## Tests

### Unit tests

Run following command under todo-list-app/backend directory to run unit tests.  

```
$ npm run test
```

### E2E tests

Run following command under todo-list-app/backend directory to run e2e tests.

```
$ npm run test:e2e
```
