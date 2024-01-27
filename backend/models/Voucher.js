// models/Voucher.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Website = require('./Website');

const Voucher = sequelize.define('Voucher', {
  voucherCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  maxAmountForDiscount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  minAmountForDiscount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, 
{
  timestamps: false,
});

// Define associations
Voucher.belongsTo(Website);
Voucher.belongsToMany(User, { through: UserVoucher });

module.exports = Voucher;
