-- queries.sql
-- Reference queries for exploring/maintaining the tasks table manually
-- (e.g. via DB Browser for SQLite or the sqlite3 CLI). These are NOT
-- run by the app itself — they're here for inspection and admin tasks.

-- 1. Get every task in the table.
SELECT * FROM tasks;

-- 2. Get only the tasks that are marked done.
SELECT * FROM tasks WHERE done = 1;

-- 3. Count how many tasks exist in total.
SELECT COUNT(*) FROM tasks;

-- 4. Mark every task as done (bulk update).
UPDATE tasks
SET done = 1;

-- 5. Permanently delete every task that's already done (bulk cleanup).
DELETE FROM tasks
WHERE done = 1;
