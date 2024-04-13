const Joi = require('joi');

const taskSchema = Joi.object({
  taskName: Joi.string().trim().min(3).required(),
  quantity: Joi.number().required(),
  frequency: Joi.string().required(),
  reminder: Joi.boolean(),
  reminderTime: Joi.date()
});

module.exports = taskSchema;