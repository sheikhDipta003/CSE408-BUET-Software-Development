// models/Wishlist.js
//this is the many to many mapping of the users saved products from ProductWebsite table
//a user can save multiple products, one product can be saved by multiple users, hence the many to many relation

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const ProductWebsite = require('./ProductWebsite');

const Wishlist = sequelize.define('Wishlist', {
  wishlistId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
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
User.belongsToMany(ProductWebsite, {through: Wishlist, foreignKey: {field: 'userId', allowNull: false}});
ProductWebsite.belongsToMany(User, {through: Wishlist, foreignKey: {field: 'pwId', allowNull: false}});
User.hasMany(Wishlist, {foreignKey: {field: 'userId', allowNull: false}});
Wishlist.belongsTo(User, {foreignKey: {field: 'userId', allowNull: false}});
ProductWebsite.hasMany(Wishlist, {foreignKey: {field: 'pwId', allowNull: false}});
Wishlist.belongsTo(ProductWebsite, {foreignKey: {field: 'pwId', allowNull: false}});


module.exports = Wishlist;
