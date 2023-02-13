const { validationResult } = require('express-validator');

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }
  next();
};

module.exports = {
  validateFields,
};
