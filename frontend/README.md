# Todo list app frontend

## Prerequisites

### Install tools

You should have following tools installed on your host.  

1. **NodeJS** (v16.19.1 is recommended.)
2. **npm** (v8.19.3 is recommended.)

You can use **nvm** to install and manage the NodeJS version on your host. After installed NodeJS using nvm the npm will also be installed.  
Please refer to the [NVM project description](https://github.com/nvm-sh/nvm).  

### Run todo-list-app postgres and backend

Before you can play with todo-list-app frontend you should have todo-list-app postgres and backend running on your host.  
Please refer to:  
1. [todo-list-app postgres project](https://github.com/david0608/todo-list-app/tree/master/postgres).  
2. [todo-list-app backend project](https://github.com/david0608/todo-list-app/tree/master/backend).  

## Get started

### Install node project dependencies

Run following command under the todo-list-app/frontend directory.  

```
$ npm install
```

### Run frontend dev server

After successfully installed dependencies, run following command to start frontend dev server.

```
$ npm run start

> todo-list-app-ui@1.0.0 start
> webpack serve --config webpack.config.dev.js

...
webpack 5.75.0 compiled successfully in 7248 ms
```

### Todo List UI

With todo-list-app postgres, backend and frontend dev server running on your host, you can enter [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser to visit todo list UI.  
