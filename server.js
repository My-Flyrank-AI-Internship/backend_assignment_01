const express = require("express");
const db = require("./db");
const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn Node.js", done: false },
  { id: 2, title: "Build a REST API", done: false },
  { id: 3, title: "Write tests", done: false },
];

app.get("/tasks", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM tasks").all();
    res.json(rows.map((r) => ({ ...r, done: Boolean(r.done) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/tasks/:id", (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ error: "Task not found" });
    res.json({ ...row, done: Boolean(row.done) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") return res.status(400).json({ error: "Title is required" });
  try {
    const info = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)").run(title, 0);
    res.status(201).json({ id: info.lastInsertRowid, title, done: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/tasks/:id", (req, res) => {
  try {
    const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Task not found" });
    const { title, done } = req.body;
    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedDone = done !== undefined ? (done ? 1 : 0) : existing.done;
    db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?").run(updatedTitle, updatedDone, req.params.id);
    res.json({ id: existing.id, title: updatedTitle, done: Boolean(updatedDone) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/tasks/:id", (req, res) => {
  try {
    const info = db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));