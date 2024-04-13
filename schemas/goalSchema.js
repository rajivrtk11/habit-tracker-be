const Joi = require('joi');

const goalSchema = Joi.object({
    goalName: Joi.string().trim().min(6).required(),
    minTimeline: Joi.date().required(),
    maxTimeline: Joi.date().required(),
});

module.exports = goalSchema;