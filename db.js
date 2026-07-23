// db.js
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync("tasks.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
`);

const row = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

if (row.count === 0) {
  const insertSample = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");
  const seedTasks = [
    { title: "Learn Node.js", done: 0 },
    { title: "Build a REST API", done: 0 },
    { title: "Write tests", done: 0 },
  ];
  for (const t of seedTasks) insertSample.run(t.title, t.done);
  console.log("Seeded tasks table with 3 sample tasks.");
} else {
  console.log(`tasks table already has ${row.count} row(s) — skipping seed.`);
}

module.exports = db;