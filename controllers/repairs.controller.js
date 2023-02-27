const { Sequelize } = require('sequelize');
const Repairs = require('../models/repairs.model');
const User = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const findAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repairs.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      [Sequelize.Op.or]: [{ status: 'pending' }, { status: 'completed' }],
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            'id',
            'createdAt',
            'updatedAt',
            'status',
            'password',
            'role',
          ],
        },
      },
    ],
  });

  if (repairs.length === 0) {
    return next(new AppError('The repair was not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'The repairs has found succesfully',
    repairs,
  });
});

const findOneRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  const repairData = await Repairs.findOne({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    where: {
      id: repair.id,
    },
    include: {
      model: User,
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt', 'status', 'password', 'role'],
      },
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'The repair has found succesfully',
    repairData,
  });
});

const createRepair = catchAsync(async (req, res, next) => {
  const { motorsNumber, description, userId } = req.body;

  const getNumber = await Repairs.findOne({
    where: {
      motorsNumber,
    },
  });

  if (getNumber) {
    return next(new AppError('The MotorNumber has been exist', 404));
  }

  const date = new Date();

  const repair = await Repairs.create({
    date,
    motorsNumber,
    description,
    userId,
  });

  res.status(200).json({
    status: 'success',
    message: 'The Repair has created succesfully',
    repair,
  });
});

const updateRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'The repair has been successfully upgraded',
    repair,
  });
});

const deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'success',
    mesage: 'The repair has deleted succesfully',
  });
});

module.exports = {
  findAllRepairs,
  findOneRepair,
  createRepair,
  updateRepair,
  deleteRepair,
};
