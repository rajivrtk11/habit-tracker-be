const Task = require("../models/taskModel");
const Goal = require("../models/goalModel");
const AppError = require("../utils/appError");
const { MAX_NUMBER_TASK } = require("../constants");
const taskSchema = require("../schemas/taskSchema");
const validateSchema = require("../utils");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const validatedData = validateSchema(taskSchema, req.body);
    let goalId = req.params.id;
    const currentGoal = await Goal.findById(goalId);

    if (!currentGoal) {
      throw new AppError(`Invalid Goal Id.`);
    } 

    if (currentGoal.tasks.length >= MAX_NUMBER_TASK) {
      throw new AppError(`A goal can have maximum ${MAX_NUMBER_TASK} tasks.`);
    }

    const {
      taskName,
      quantity,
      frequency,
      reminder,
      reminderTime,
      logs,
    } = validatedData;

    const task = await Task.create({
      goalId,
      taskName,
      quantity,
      frequency,
      reminder,
      reminderTime,
      logs,
    });

    await Goal.findByIdAndUpdate(goalId, { $push: { tasks: task._id } });
    res.status(201).json({ message: "Task created successfully", task: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks by goal ID
exports.getTasksByGoalId = async (req, res) => {
  try {
    const tasks = await Task.find({ goalId: req.params.goalId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task by ID
exports.updateTask = async (req, res) => {
  try {
    const validatedData = validateSchema(taskSchema, req.body);

    const {
      taskName,
      quantity,
      frequency,
      reminder,
      reminderTime,
      logs,
    } = validatedData;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { taskName, quantity, frequency, reminder, reminderTime, logs },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete task by ID
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findById(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await deletedTask.deleteOne();
    //If the child object is associated with a parent object, 
    //update the parent object to remove the reference to the child object
    if (deletedTask.goalId) {
      const goal = await Goal.findById(deletedTask.goalId);
      
      if (goal) {
        goal.tasks = goal.tasks.filter(
          (taskId) => taskId.toString() !== deletedTask._id.toString()
        );
        await goal.save();
      }
    }

    // await task.delete();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
