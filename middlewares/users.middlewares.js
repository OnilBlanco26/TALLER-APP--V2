const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');

const validateUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!user) {
    res.status(404).json({
      status: 'error',
      message: 'user was not found',
    });
  }

  req.user = user;
  next();
});

const validateUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user && !user.status) {
    return res.status(400).json({
      status: 'error',
      message:
        'The user has an account, but it is deactivated, please contact the administrator to activate it.',
    });
  }

  if (user) {
    return res.status(400).json({
      status: 'error',
      message: 'The email user already exists',
    });
  }
  req.user = user;
  next();
});

module.exports = {
  validateUserById,
  validateUserByEmail,
};
