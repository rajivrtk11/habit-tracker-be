const Task = require("../models/taskModel");
const Goal = require("../models/goalModel");
const goalSchema = require("../schemas/goalSchema.js");
const validateSchema = require("../utils/index.js");

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const validatedData = validateSchema(goalSchema, req.body);

    const { goalName, minTimeline, maxTimeline } = validatedData;

    const newGoal = new Goal({
      userId,
      goalName,
      minTimeline,
      maxTimeline,
      tasks: [],
    });

    await newGoal.save();

    res
      .status(201)
      .json({
        message: "Goal created successfully",
        goal: newGoal
      });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all goals by user ID
// exports.getGoalsByUserId = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const goals = await Goal.find({ userId });
//     res.status(200).json(goals);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//Get goal by id
exports.getGoalsByGoalId = async (req, res) => {
  try {
    const goalId = req.params.id;
    const goals = await Goal.findById(goalId).populate({
        path: "tasks",
        model: "Task",
    });;
    
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update goal by ID
exports.updateGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const validatedData = validateSchema(goalSchema, req.body);
    const { goalName, minTimeline, maxTimeline } = validatedData;
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { goalName, minTimeline, maxTimeline },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res
      .status(200)
      .json({ message: "Goal updated successfully", goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete goal by ID
exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goalId = req.params.id;
    const deletedGoal = await Goal.findByIdAndDelete(goalId);

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    await Task.deleteMany({ userId, goalId });

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all goals of a user with subtasks (with pagination)
exports.getAllUserGoalsWithSubtasks = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = req.query.page || 1;
    const limit = req.query.limit || 10; // Default limit to 10 documents per page

    // Calculate the starting index of documents
    const startIndex = (page - 1) * limit;

    // Retrieve user ID from the authenticated user
    const userId = req.user._id;

    // Query to retrieve goals of the user with subtasks
    const goals = await Goal.find({ userId })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: "tasks",
        model: "Task",
      });

    // Count total number of documents
    const totalDocuments = await Goal.countDocuments({ userId });

    // Calculate total number of pages
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      status: "success",
      results: goals.length,
      data: {
        goals,
        totalPages,
        currentPage: page,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
