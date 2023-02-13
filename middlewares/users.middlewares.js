const User = require('../models/users.model');
const AppError = require('../utils/appError');
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
    return next(new AppError('User was not found', 404));
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
    return next(
      new AppError(
        'The user has an account, but it is deactivated, please contact the administrator to activate it.',
        400
      )
    );
  }

  if (user) {
    return next(new AppError('The email user already exists', 400));
  }
  req.user = user;
  next();
});

module.exports = {
  validateUserById,
  validateUserByEmail,
};
