const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  renewToken,
} = require('../controllers/users.controller');
const {
  validateUserById,
  validateUserByEmail,
  valideIfExistUserByEmail,
  protect,
  protectAccountOwner,
  restricTo,
} = require('../middlewares/users.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findAllUsers);

router.get('/:id', validateUserById, findOneUser);

router.get('/renew', protect, renewToken);

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

router.post(
  '/login',
  [
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').isEmail(),
    check('password', 'The password must be mandatory'),
    valideIfExistUserByEmail,
    validateFields,
  ],
  login
);

router.use(protect);

router.patch('/:id', validateUserById, protectAccountOwner, updateUser);

router.delete('/:id', protectAccountOwner, deleteUser);

module.exports = {
  userRouter: router,
};
