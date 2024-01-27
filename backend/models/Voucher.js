// models/Voucher.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Website = require('./Website');
const User = require('./User');

const Voucher = sequelize.define('Voucher', {
  voucherId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
Voucher.belongsTo(Website, {foreignKey: {field: 'websiteId', allowNull: false}});
Website.hasMany(Voucher, {foreignKey: {field: 'websiteId', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});

module.exports = Voucher;
