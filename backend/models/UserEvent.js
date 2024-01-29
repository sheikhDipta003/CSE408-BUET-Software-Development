// models/UserEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const UserEvent = sequelize.define('UserEvent', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
    timestamps: false,
  });

User.belongsToMany(Event, {through: UserEvent, foreignKey: {field: 'userId', allowNull:false}});
Event.belongsToMany(User, {through: UserEvent, foreignKey: {field: 'eId', allowNull: false}});
User.hasMany(UserEvent, {foreignKey: {field: 'userId', allowNull: false}});
Event.hasMany(UserEvent, {foreignKey: {field: 'eId', allowNull: false}});
UserEvent.belongsTo(User, {foreignKey: {field: 'userId', allowNull: false}});
UserEvent.belongsTo(Event, {foreignKey: {field: 'eId', allowNull: false}});

module.exports = UserEventInterest;
