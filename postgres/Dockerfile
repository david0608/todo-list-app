FROM postgres
COPY init.sql /docker-entrypoint-initdb.d/
ENV POSTGRES_USER postgres
ENV POSTGRES_DB todo_list_app
ENV POSTGRES_HOST_AUTH_METHOD trust
