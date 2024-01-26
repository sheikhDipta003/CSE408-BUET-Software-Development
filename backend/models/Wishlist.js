// models/Wishlist.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const ProductWebsite = require('./ProductWebsite');

const Wishlist = sequelize.define('Wishlist', {
  dateAdded: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, 
{
  timestamps: false,
});

// Define associations
Wishlist.belongsTo(User);
Wishlist.belongsTo(ProductWebsite);

module.exports = Wishlist;
