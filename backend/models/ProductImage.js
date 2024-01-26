// models/ProductImage.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageOrder: {
    type: DataTypes.INTEGER,
  }
});
ProductImage.belongsTo(Product, { foreignKey: 'productId' });
module.exports = ProductImage;
