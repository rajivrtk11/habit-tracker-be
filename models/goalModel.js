const mongoose = require("mongoose");
const Task = require('./taskModel')
const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalName: {
      type: String,
      required: [true, "Goal name is required."],
    },
    minTimeline: {
      type: Date,
      required: [true, "Min timline is required."],
    },
    maxTimeline: {
      type: Date,
      required: [true, "Max timeline is required"],
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    // Apply custom validator to ensure tasks array length does not exceed 2
    validate: {
      validator: function (tasks) {
        return tasks.length <= 2;
      },
      message: "A goal can have at most 2 tasks.",
    },
  }
);

module.exports = mongoose.model("Goal", goalSchema);
