// models/Product.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const ProductImage = require('./ProductImage'); // Import the ProductImage model
//const ProductWebsite = require('./ProductWebsite');

const Product = sequelize.define('Product', {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  width: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Define the one-to-many association with ProductImage
// Product.hasMany(ProductImage, {
//   foreignKey: 'productId',
//   onDelete: 'CASCADE', // Delete associated images when a product is deleted
// });
//Product.belongsToMany(Website, { through: ProductWebsite });

module.exports = Product;
