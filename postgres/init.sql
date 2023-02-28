SELECT 'CREATE DATABASE todo_list_app' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todo_list_app')\gexec

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
