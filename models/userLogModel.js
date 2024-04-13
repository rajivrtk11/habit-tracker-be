const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  timestamp: { type: Date, default: Date.now },
  quantityCompleted: { type: Number, required: true },
});

module.exports = mongoose.model('UserLog', userLogSchema);
