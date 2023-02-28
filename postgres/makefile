container-name := pg-todo-list-app
image-name := pg-todo-list-app
host-port := 54321

.PHONY: run stop rm clean image

run: image
	docker run --name $(container-name) -p $(host-port):5432 -e POSTGRES_HOST_AUTH_METHOD=trust -d $(image-name)

image:
	docker build -t $(image-name) .

clean: stop rm rmi

stop:
	docker stop $(container-name)

rm:
	docker rm $(container-name)

rmi:
	docker rmi $(image-name)

login:
	docker exec -it $(container-name) /bin/bash
