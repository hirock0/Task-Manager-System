import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/user.route.js";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import mongoose from "mongoose";
import http from "http";
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_SIDE_URL;
const clientUrl2 = process.env.MONGODB_URI_SECOND;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientUrl2,
  },
});

app.use(express.json());
app.use(express.urlencoded({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: clientUrl || clientUrl2,
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
  default: { type: Boolean, required: false },
  order: { type: Number, required: true }, // Required for sorting
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const existingTasks = await Task.find({ category });
    const order = existingTasks.length; // New task gets the last order

    const newTask = new Task({ title, description, category, order});
    await newTask.save();

    const tasks = await Task.find().sort({ order: 1 });
    io.emit("updateTasks", tasks); // Broadcast update
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);

    const tasks = await Task.find().sort({ order: 1 });
    io.emit("updateTasks", tasks); // Broadcast update
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        order: i, // Assign new order
      });
    }

    const tasks = await Task.find().sort({ order: 1 });
    io.emit("updateTasks", tasks); // Broadcast update
    res.json({ message: "Tasks reordered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
