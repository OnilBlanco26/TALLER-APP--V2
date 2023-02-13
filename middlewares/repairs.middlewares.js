const Repairs = require('../models/repairs.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const validateRepairByStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repairs.findOne({
    where: {
      id,
    },
  });

  if (!repair || repair.status === 'cancelled') {
    return next(new AppError('The repair was not found', 404));
  }

  if (repair.status === 'completed') {
    return next(new AppError('The repair has a status completed', 400));
  }

  req.repair = repair;
  next();
});

const validateIfExistRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repairs.findOne({
    where: {
      id,
    },
  });

  if (!repair || repair.status === 'cancelled') {
    return next(new AppError('repairs was not found', 404));
  }

  req.repair = repair;
  next();
});

module.exports = {
  validateRepairByStatus,
  validateIfExistRepair,
};
