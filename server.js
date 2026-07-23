const express = require("express");
const db = require("./db");
const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn Node.js", done: false },
  { id: 2, title: "Build a REST API", done: false },
  { id: 3, title: "Write tests", done: false },
];
let nextId = 4;

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
  const newTask = { id: nextId++, title, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  const { title, done } = req.body;
  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  tasks.splice(index, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));