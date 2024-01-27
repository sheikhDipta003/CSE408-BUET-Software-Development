// models/UserVoucher.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Voucher = require('./Voucher');

const UserVoucher = sequelize.define('UserVoucher', {
  // Foreign keys
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Assuming the User model is named Users
      key: 'id',
    },
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vouchers', // Assuming the Voucher model is named Vouchers
      key: 'id',
    },
  },
  dateAdded: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
    timestamps: false,
  });

User.belongsToMany(Voucher, { through: UserVoucher, foreignKey: 'userId' });
Voucher.belongsToMany(User, { through: UserVoucher, foreignKey: 'voucherId' });

module.exports = UserVoucher;
