import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Get all tasks (for logged-in user only)
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟢 Add a new task
router.post("/", protect, async (req, res) => {
  try {
    const { title, category } = req.body;
    const newTask = new Task({ userId: req.user._id, title, category });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🟡 Update a task
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 🔴 Delete a task
router.delete("/:id", protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
