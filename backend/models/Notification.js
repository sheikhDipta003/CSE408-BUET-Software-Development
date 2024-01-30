// models/UserNotification.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const UserNotification = sequelize.define(
  "UserNotification",
  {
    notifId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

User.hasMany(UserNotification, {
  foreignKey: { field: "userId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UserNotification.belongsTo(User, {
  foreignKey: { field: "userId", allowNull: false },
});
module.exports = UserNotification;
