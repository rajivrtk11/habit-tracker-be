const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  taskName: { type: String, required: true },
  quantity: { type: Number, required: true },
  frequency: { type: String, required: true }, // Options: 'daily', 'weekly', etc.
  reminder: { type: Boolean, default: false },
  reminderTime: { type: Date },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserLog' }],
});

module.exports = mongoose.model('Task', taskSchema);
