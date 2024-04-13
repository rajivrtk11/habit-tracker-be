const AppError = require('./../utils/appError');

const validateSchema = (schema, validationObject) => {
  const { value, error } = schema.validate(validationObject);

  if (error) {
    throw new AppError(error.message, 400);
  }

  return value;
};

module.exports = validateSchema;