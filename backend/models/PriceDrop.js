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
    type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
    allowNull: false,
  }
}, {
    timestamps: false,
  });

// Define associations
User.belongsToMany(ProductWebsite, {through: PriceDrop});
ProductWebsite.belongsToMany(User, {through: PriceDrop});
User.hasMany(PriceDrop, {onDelete: 'CASCADE', onUpdate: 'CASCADE'});
ProductWebsite.hasMany(PriceDrop, {onDelete: 'CASCADE', onUpdate: 'CASCADE'});
PriceDrop.belongsTo(User);
PriceDrop.belongsTo(ProductWebsite);

module.exports = Wishlist;
