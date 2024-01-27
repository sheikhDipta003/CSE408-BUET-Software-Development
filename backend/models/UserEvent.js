// models/UserEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const UserEvent = sequelize.define('UserEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
    timestamps: false,
  });

User.belongsToMany(Event, {through: UserEvent});
Event.belongsToMany(User, {through: UserEvent});

module.exports = UserEventInterest;
