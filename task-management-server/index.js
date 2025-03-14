import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/user.route.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_SIDE_URL;
const clientUrl2 = process.env.MONGODB_URI_SECOND;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
mongoose.connect(clientUrl2);

// Task Schema & Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 200 },
  category: {
    type: String,
    enum: ["To-Do", "In Progress", "Done"],
    required: true,
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userId: { type: String, required: true },
  default: { type: Boolean, required: false },
  order: { type: Number, required: true }, // Required for sorting
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ order: 1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// Get usert tasks

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ userId: id }).sort({ order: 1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, category, userName, userEmail, userId } =
      req.body;
    const existingTasks = await Task.find({ category });
    const order = existingTasks.length; // New task gets the last order

    const newTask = new Task({
      title,
      description,
      category,
      order,
      userName,
      userEmail,
      userId,
    });
    await newTask.save();
    return res.status(201).json({
      message: "Task added successfully",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: true });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task deleted", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update tasks
app.put("/tasks/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reqBody = await req.body;
    await Task.findByIdAndUpdate(id, reqBody);
    return res.status(200).json({ message: "Task deleted", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Reorder tasks after drag-and-drop
app.put("/tasks/reorder", async (req, res) => {
  try {
    const { updatedTasks } = req.body;
    // Update order field for each task
    for (let i = 0; i < updatedTasks.length; i++) {
      await Task.findByIdAndUpdate(updatedTasks[i]._id, {
        category: updatedTasks[i].category,
        order: i,
      });
    }
    return res
      .status(200)
      .json({ message: "Tasks reordered successfully", success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.listen(port || 5000, () => {
  console.log(`Backend is running on port ${port}`);
});
