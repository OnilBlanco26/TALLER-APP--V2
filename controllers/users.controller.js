const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');

const findAllUsers = catchAsync(async (req, res) => {
  const user = await User.findAll({
    where: {
      status: true,
    },
  });

  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'No user found',
    });
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

  res.status(200).json({
    status: 'success',
    message: 'The user was created successfully',
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

module.exports = {
  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  deleteUser,
};