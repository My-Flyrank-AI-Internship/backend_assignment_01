# Task CRUD API — Postgres in Docker

## Project Overview

A minimal REST API for managing a task list, built with **Node.js**, **Express**, and **Postgres**. The entire stack (Node.js server and PostgreSQL database) runs containerized and launches with a single command. The API contract remains consistent across storage backends, and storage details are abstracted by `repository.js`.

## Features

- Full CRUD support for tasks: Create, Read, Update, Delete
- Persistent storage using PostgreSQL backed by a named Docker volume (`taskdata`)
- Stack orchestration using Docker Compose
- Environment variable configuration via `.env`
- Automatic database table creation and seeding on startup (seeds 3 sample tasks if the table is empty)
- Input validation and proper HTTP status code responses

## Folder Structure

```
task-crud-api/
│── Dockerfile         # App image build specification
│── compose.yaml       # App and Database services configuration
│── server.js          # Express app + all route handlers
│── repository.js      # Postgres connection, table setup, and query operations
│── queries.sql        # Reference SQL queries
│── .env.example       # Template for environment configuration
│── .env               # Local environment variables (gitignored)
│── .gitignore
│── .dockerignore
│── package.json
└── README.md
```

## Installation & Running

### One-Command Startup (Docker Compose)

Start the entire application and database stack with:

```bash
docker compose up
```

This builds the Node.js application image, starts the PostgreSQL database container with persistent volume storage, initializes the database schema, seeds the table if empty, and runs the API server.

### Environment Variables

Before starting the server, ensure your environment variables are configured. A template is provided in [.env.example](file:///.env.example). Create a `.env` file (gitignored) at the project root with the following fields:

```env
DATABASE_URL=postgres://postgres:dev@db:5432/tasks
PORT=3000
```
Note: When running the Node.js application locally on the host instead of through Docker Compose, point `DATABASE_URL` to `localhost:5432` (or your host-bound database IP).

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a single task by id |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task's title and/or done status |
| DELETE | `/tasks/:id` | Delete a task |

## Example Requests & Responses

### Pasted `curl -i` output for GET /tasks:
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 140
ETag: W/"8c-BoqWpv18wjvomRbn3F99FF+IHAc"
Date: Sat, 01 Aug 2026 09:38:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[
  {"id":1,"title":"Learn Node.js","done":false},
  {"id":2,"title":"Build a REST API","done":false},
  {"id":3,"title":"Write tests","done":false}
]
```

---

## Database Verification & CLI Screenshot

Here is the output showing that the `tasks` table is successfully created and seeded inside the `taskdb` container:

```bash
$ docker exec -it taskdb psql -U postgres -d tasks

tasks=# \dt
         List of relations
 Schema | Name  | Type  |  Owner   
--------+-------+-------+----------
 public | tasks | table | postgres
(1 row)

tasks=# SELECT * FROM tasks;
 id |      title       | done 
----+------------------+------
  1 | Learn Node.js    | f
  2 | Build a REST API | f
  3 | Write tests      | f
(3 rows)
```

## Example SQL Query

All queries in `repository.js` are parameterized for security. For example, looking up a single task by ID:

```sql
SELECT * FROM tasks WHERE id = $1;
```
The `$1` placeholder represents the parameter bound at execution time, which protects the application from SQL injection.
