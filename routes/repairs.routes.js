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
const { protect, restricTo } = require('../middlewares/users.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.use(protect)

router.get('/', restricTo('employee'), findAllRepairs);

router.get('/:id', restricTo('employee'), validateIfExistRepair, findOneRepair);

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

router.patch('/:id',restricTo('employee') ,validateRepairByStatus, updateRepair);

router.delete('/:id',restricTo('employee'), validateRepairByStatus, deleteRepair);

module.exports = {
  repairsRouter: router,
};
