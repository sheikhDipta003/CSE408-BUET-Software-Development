// models/ProductPrice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductWebsite = require('./ProductWebsite');

const ProductPrice = sequelize.define('ProductPrice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY, // Assuming a date data type for the date
    allowNull: false,
  },
}, {
    timestamps: false,
  });

ProductWebsite.hasMany(ProductPrice, {foreignKey: {field: 'productId', allowNull: false}});
ProductPrice.belongsTo(ProductWebsite, {foreignKey: {field: 'productId', allowNull: false}});
module.exports = ProductPrice;
