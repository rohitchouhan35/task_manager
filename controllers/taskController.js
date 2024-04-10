import express from "express";
import Task from "../models/task.model.js";
import checkUserRole, {authenticateUser} from '../middleware/auth.js';

const taskRouter = express.Router();

// Create a new task
taskRouter.post("/createTask", authenticateUser, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
    });

    await newTask.save();

    res.status(200).json({
      status: "success",
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

// Get all tasks
taskRouter.get("/getAllTasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

// Get a task by ID
taskRouter.get("/getTask/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404).json({
        status: "error",
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

// Update a task
taskRouter.put("/updateTask/:taskId", authenticateUser, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      res.status(404).json({
        status: "error",
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

// Delete a task
taskRouter.delete("/deleteTask/:taskId", checkUserRole, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);

    if (!deletedTask) {
      res.status(404).json({
        status: "error",
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

// Assign a task to a user
taskRouter.post("/assignTask/:taskId", async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404).json({
        status: "error",
        message: "Task not found",
      });
      return;
    }

    task.assignedTo = userId;
    await task.save();

    res.status(200).json({
      status: "success",
      message: "Task assigned successfully",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing the request",
    });
  }
});

taskRouter.post('/teacherEndPoint', checkUserRole, async (req, res) => {
  try {
    res.status(200).json({ status: 'success', message: 'Tasks endpoint for teachers' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default taskRouter;
