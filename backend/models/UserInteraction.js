// models/UserInteraction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const ProductWebsite = require('./ProductWebsite');

const UserInteraction = sequelize.define('UserInteraction', {
  intId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  timestamps: false,
});

User.belongsToMany(ProductWebsite, {through: UserInteraction, foreignKey: {field: 'userId', allowNull: false}}),
ProductWebsite.belongsToMany(User, {through: UserInteraction, foreignKey: {field: 'pwId', allowNull: false}})
User.hasMany(UserInteraction, {foreignKey: {field: 'userId', allowNull: false}}),
UserInteraction.belongsTo(User, {foreignKey: {field: 'userId', allowNull: false}}),
ProductWebsite.hasMany(UserInteraction, {foreignKey: {field: 'pwId', allowNull: false}}),
UserInteraction.belongsTo(ProductWebsite, {foreignKey: {field: 'pwId', allowNull: false}})

module.exports = UserInteraction;
