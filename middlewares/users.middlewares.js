const {promisify} = require('util')
const User = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken')


const protect = catchAsync(async (req, res, next) => {
  //1 Verificar que llegue el token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  //2 Validar token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  //3 Verificar que el usuario exista
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token if not longer available', 401)
    );
  }

  //4 Verificar si el usuario ha cambiado la contraseña despues de que el token haya expirado

  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      return next(
        new AppError(
          'User recently changed password!, please login again.',
          401
        )
      );
    }
  }

  req.sessionUser = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id)
    next(new AppError('You do not own this account', 401));

  next();
});

const restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perfom this action. !', 403)
      );
    }

    next();
  };
};

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

const valideIfExistUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Incorrect email or password',
    });
  }

  req.user = user;
  next();
});

module.exports = {
  validateUserById,
  validateUserByEmail,
  valideIfExistUserByEmail,
  protect,
  protectAccountOwner,
  restricTo
};
