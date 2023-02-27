const User = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

const findAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.findAll({
    where: {
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'List of found users',
    user,
  });
});

const findOneUser = catchAsync(async (req, res) => {
  const { user } = req;

  res.json({
    status: 'success',
    message: 'User has found succesfully',
    user,
  });
});

const createUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    role,
  });

  // ENCRIPTAR LA CONTRASEÑA
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);


  await user.save();

  const token = await generateJWT(user.id)

  res.status(200).json({
    status: 'success',
    message: 'The user was created successfully',
    token,
    user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { user } = req;
  const { name, email, role } = req.body;

  const updateUser = await user.update({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    role,
  });

  res.json({
    status: 'success',
    message: 'User was updated succesfully',
    updateUser,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { user } = req;
  await user.update({ status: false });

  res.json({
    status: 'success',
    message: 'User delete was succesfully',
  });
});

const login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  const {user} = req;

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user
  })

})

const renewToken = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const token = await generateJWT(id);

  const user = await User.findOne({
    where: {
      status: true,
      id,
    },
  });

  return res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


module.exports = {
  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  renewToken
};
