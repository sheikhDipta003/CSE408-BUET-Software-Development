// models/Spec.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const Spec = sequelize.define('Spec', {
  specId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  specTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

Spec.belongsTo(Product, {foreignKey: {field: 'productId', allowNull: false}});
Product.hasMany(Spec, {foreignKey: {field: 'productId', allowNull: false}, onDelete: 'CASCADE', onUpdate: 'CASCADE'});
module.exports = Spec;