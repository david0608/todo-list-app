# Todo list app postgres

## Prerequisites

You should have following tools installed on your host.
1. GNU Make. Please refer to: [Linux](https://linuxhint.com/install-make-ubuntu/), [MacOS](https://formulae.brew.sh/formula/make).
2. Docker. Please refer to: [Linux](https://linnote.com/how-to-install-docker-in-ubuntu/), [MacOS](https://docs.docker.com/desktop/install/mac-install/).

## Usage examples

### Run postgres container

Under the directory which the makefile aside, execute following command.

```
$ make
```

This command will pull the official postgres image and build our pg-todo-list-app container image on top of it.  
After successfully build, the pg-todo-list-app container will automatically created and started.  
You can run following command to check if the container is running.  

```
$ docker ps -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                     NAMES
345eb2208dfe   pg-todo-list-app         "docker-entrypoint.s…"   8 minutes ago   Up 8 minutes   0.0.0.0:54321->5432/tcp   pg-todo-list-app
```

### Cleanup

Any time you want to cleanup the container and image we just created, e.g, you have done with the demo of the todo-list app. You can just run following command.

```
$ make clean
...

$ docker ps -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                     NAMES

$ docker images
REPOSITORY         TAG               IMAGE ID       CREATED        SIZE
postgres           latest            680aba37fd0f   2 weeks ago    379MB
```
