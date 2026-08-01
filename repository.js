// repository.js
// The only file that talks to the database. Routes in server.js call
// these functions and never see SQL or a connection directly — that's
// what makes the next storage swap (if there ever is one) touch only
// this file again.

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*) AS count FROM tasks");
  const count = Number(rows[0].count);

  if (count === 0) {
    await pool.query(`
      INSERT INTO tasks (title, done) VALUES
        ('Learn Node.js', false),
        ('Build a REST API', false),
        ('Write tests', false)
    `);
    console.log("Seeded tasks table with 3 sample tasks.");
  } else {
    console.log(`tasks table already has ${count} row(s) — skipping seed.`);
  }
}

async function getAll() {
  const { rows } = await pool.query("SELECT * FROM tasks ORDER BY id");
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  return rows[0] || null;
}

async function create(title) {
  const { rows } = await pool.query(
    "INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING *",
    [title]
  );
  return rows[0];
}

async function update(id, { title, done }) {
  const existing = await getById(id);
  if (!existing) return null;
  const updatedTitle = title !== undefined ? title : existing.title;
  const updatedDone = done !== undefined ? Boolean(done) : existing.done;
  const { rows } = await pool.query(
    "UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *",
    [updatedTitle, updatedDone, id]
  );
  return rows[0];
}

async function remove(id) {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  return result.rowCount > 0;
}

module.exports = { init, getAll, getById, create, update, remove };
