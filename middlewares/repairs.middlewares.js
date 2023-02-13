const Repairs = require('../models/repairs.model');
const catchAsync = require('../utils/catchAsync');

const validateRepairByStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repairs.findOne({
    where: {
      id,
    },
  });

  if (!repair || repair.status === 'cancelled') {
    return res.status(400).json({
      status: 'error',
      message: 'The repair was not found',
    });
  }

  if (repair.status === 'completed') {
    return res.status(400).json({
      status: 'error',
      message: 'The repair has a status completed',
    });
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
    return res.status(400).json({
      status: 'error',
      message: 'The repair was not found',
    });
  }

  req.repair = repair;
  next();
});

module.exports = {
  validateRepairByStatus,
  validateIfExistRepair,
};
