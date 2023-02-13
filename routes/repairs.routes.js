const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllRepairs,
  findOneRepair,
  createRepair,
  updateRepair,
  deleteRepair,
} = require('../controllers/repairs.controller');
const {
  validateRepairByStatus,
  validateIfExistRepair,
} = require('../middlewares/repairs.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findAllRepairs);

router.get('/:id', validateIfExistRepair, findOneRepair);

router.post(
  '/',
  [
    check('motorsNumber', 'The Motor Number must be mandatory').not().isEmpty(),
    check('description', 'The description must be mandatory').not().isEmpty(),
    check('userId', 'The description must be mandatory').not().isEmpty(),
    validateFields,
  ],
  createRepair
);

router.patch('/:id', validateRepairByStatus, updateRepair);

router.delete('/:id', validateRepairByStatus, deleteRepair);

module.exports = {
  repairsRouter: router,
};
