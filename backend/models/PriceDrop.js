//this is the many to many mapping of the users saved price drops from ProductWebsite table
//a user can save multiple products, one product can be saved by multiple users, hence the many to many relation

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const ProductWebsite = require('./ProductWebsite');

const PriceDrop = sequelize.define('PriceDrop', {
  dateAdded: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
    timestamps: false,
  });

// Define associations
User.belongsToMany(ProductWebsite, {through: PriceDrop, foreignKey: {field: 'userId', allowNull: false}});
ProductWebsite.belongsToMany(User, {through: PriceDrop, foreignKey: {field: 'pwId', allowNull: false}});
User.hasMany(PriceDrop, {foreignKey: {field: 'userId', allowNull: false}});
ProductWebsite.hasMany(PriceDrop, {foreignKey: {field: 'pwId', allowNull: false}});
PriceDrop.belongsTo(User, {foreignKey: {field: 'userId', allowNull: false}});
PriceDrop.belongsTo(ProductWebsite, {foreignKey: {field: 'pwId', allowNull: false}});

module.exports = Wishlist;
