# Task CRUD API — SQLite Edition

## Project Overview

A minimal, beginner-friendly REST API for managing a task list, built with **Node.js** and **Express**. This project started as an in-memory CRUD API (Assignment 1) and has been migrated to use a persistent **SQLite** database via `better-sqlite3` — without changing a single endpoint, request body, response body, or status code.

Tasks now survive server restarts, since they're stored on disk in `tasks.db` instead of a JavaScript array that resets every time the process stops.

## Features

- Full CRUD support for tasks: Create, Read, Update, Delete
- Persistent storage using SQLite — no data loss on restart
- Automatic database and table creation on first run
- Automatic seeding with 3 sample tasks (only if the table is empty)
- Input validation (empty/missing `title` rejected)
- Consistent error responses with proper HTTP status codes
- Parameterized SQL queries throughout — no SQL injection risk
- Clean, modular code separating the database layer (`db.js`) from the API layer (`server.js`)

## Folder Structure

```
task-crud-api/
│── server.js        # Express app + all route handlers
│── db.js             # SQLite connection, table setup, and seeding logic
│── queries.sql        # Reference SQL queries for manual inspection/admin
│── tasks.db           # SQLite database file (created automatically, gitignored)
│── package.json
│── package-lock.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```
2. Navigate into the project folder:
   ```bash
   cd task-crud-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework — routing and JSON body parsing |
| `better-sqlite3` | Synchronous, fast SQLite driver for Node.js |

## How to Run

```bash
node server.js
```

The server starts at:

```
http://localhost:3000
```

On the very first run, `tasks.db` is created automatically and seeded with 3 sample tasks. On every later run, the app detects existing data and skips seeding.

## Database Location

The database lives in a single file at the project root:

```
./tasks.db
```

There's no separate database server to install or configure — the entire database is just this one file, which is created automatically the first time the app runs.

## Why SQLite Was Chosen

- **Zero setup** — no separate database server to install, configure, or run in the background; the whole database is one file.
- **Perfect fit for the assignment's scale** — a small task list doesn't need a heavyweight client-server database.
- **Easy to inspect** — the `.db` file can be opened directly in tools like [DB Browser for SQLite](https://sqlitebrowser.org/) to view/edit data visually.
- **Persistence with minimal code** — `better-sqlite3` gives a synchronous API that's simple to reason about for a small CRUD app, while still using real SQL and parameterized queries.
- **Portable** — the whole database can be copied, backed up, or shared as a single file.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a single task by id |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task's title and/or done status |
| DELETE | `/tasks/:id` | Delete a task |

## Example Requests

**Get all tasks**
```bash
curl http://localhost:3000/tasks
```

**Get a single task**
```bash
curl http://localhost:3000/tasks/2
```

**Create a task**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn SQLite"}'
```

**Update a task**
```bash
curl -X PUT http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"title": "Build a REST API v2", "done": true}'
```

**Delete a task**
```bash
curl -X DELETE http://localhost:3000/tasks/2
```

## Example Responses

**GET /tasks**
```json
[
  { "id": 1, "title": "Learn Node.js", "done": false },
  { "id": 2, "title": "Build a REST API", "done": false },
  { "id": 3, "title": "Write tests", "done": false }
]
```

**POST /tasks (success)**
```json
{ "id": 4, "title": "Learn SQLite", "done": false }
```

**POST /tasks (empty title)**
```json
{ "error": "Title is required" }
```
Status: `400`

**GET /tasks/:id (unknown id)**
```json
{ "error": "Task not found" }
```
Status: `404`

**DELETE /tasks/:id (success)**

No response body. Status: `204`

## Screenshot: Viewing the Database in DB Browser for SQLite

> _Add a screenshot here showing `tasks.db` opened in DB Browser for SQLite, with the `tasks` table and its rows visible._

```
[ screenshot placeholder — insert PNG/JPG of DB Browser here ]
```

## Example SQL Query

Looking up a single task by id (this is exactly what `GET /tasks/:id` runs internally):

```sql
SELECT * FROM tasks WHERE id = ?;
```

The `?` is a parameter placeholder filled in safely by `better-sqlite3` at query time — the id is never concatenated directly into the SQL string, which is what protects the app from SQL injection.

See `queries.sql` for more reference queries (filtering by `done`, counting rows, bulk update, bulk delete).

## Future Improvements

- Add pagination and filtering to `GET /tasks` (e.g. `?done=true`, `?limit=10`)
- Add request validation with a library like `zod` or `joi`
- Add automated tests (unit + integration) with a test database
- Add a `created_at` / `updated_at` timestamp to each task
- Support sorting (e.g. by title or completion status)
- Add basic authentication if the API is ever exposed publicly
