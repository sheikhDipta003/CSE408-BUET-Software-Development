// models/UserInteraction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const UserInteraction = sequelize.define('UserInteraction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Assuming the User model is named Users
      key: 'userId',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', // Assuming the Product model is named Products
      key: 'id',
    },
  },
  interactionType: {
    type: DataTypes.ENUM('search', 'click'), // Interaction type: search or click
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = UserInteraction;
