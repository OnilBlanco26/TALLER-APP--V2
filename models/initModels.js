const Repairs = require('./repairs.model');
const User = require('./users.model');

const initModel = () => {
  User.hasMany(Repairs);
  Repairs.belongsTo(User);
};

module.exports = initModel;
