require("dotenv").config();
const repository = require("./repository");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await repository.getAll();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await repository.getById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const task = await repository.create(title);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await repository.update(req.params.id, req.body);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await repository.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

const PORT = process.env.PORT || 3000;
repository.init().then(() => {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});