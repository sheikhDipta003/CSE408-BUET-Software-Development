// models/ProductWebsite.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Website = require('./Website')

const ProductWebsite = sequelize.define('ProductWebsite', {
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product, // 'Movies' would also work
      key: 'productId'
    }
  },
  websiteId: {
    type: DataTypes.INTEGER,
    references: {
      model: Website, // 'Actors' would also work
      key: 'websiteId'
    }
  },
  shippingTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, 
{
  timestamps: false,
});

//Product.belongsToMany(Website, {through: ProductWebsite});
//Website.belongsToMany(Product, {through: ProductWebsite});

module.exports = ProductWebsite;
