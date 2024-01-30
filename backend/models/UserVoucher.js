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
      model: 'Users',
      key: 'id',
    },
  },
  voucherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vouchers',
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

User.belongsToMany(Voucher, { through: UserVoucher, foreignKey: {field: 'userId', allowNull: false} });
Voucher.belongsToMany(User, { through: UserVoucher, foreignKey: {field: 'voucherId', allowNull: false}});
User.hasMany(UserVoucher, {foreignKey: {field: 'userId', allowNull: false}});
Voucher.hasMany(UserVoucher, {foreignKey: {field: 'voucherId', allowNull: false}});
UserVoucher.belongsTo(User, {foreignKey: {field: 'userId', allowNull: false}});
UserVoucher.belongsTo(Voucher, {foreignKey: {field: 'voucherId', allowNull: false}});

module.exports = UserVoucher;
