const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller');
const {
  validateUserById,
  validateUserByEmail,
} = require('../middlewares/users.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findAllUsers);

router.get('/:id', validateUserById, findOneUser);

router.post(
  '/',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('email', 'The name must be mandatory').not().isEmpty(),
    check('email', 'The name must be mandatory').isEmail(),
    check('password', 'The name must be mandatory').not().isEmpty(),
    validateUserByEmail,
    validateFields,
  ],
  createUser
);

router.patch('/:id', validateUserById, updateUser);

router.delete('/:id', deleteUser);

module.exports = {
  userRouter: router,
};
