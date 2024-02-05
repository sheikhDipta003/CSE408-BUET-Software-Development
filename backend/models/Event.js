// models/Event.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Website = require("./Website");

const Event = sequelize.define(
  "Event",
  {
    eId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true, // Validate that the value is a URL
      },
    },
  },
  {
    timestamps: false,
  },
);

// Associate the Event model with the Website model
Website.hasMany(Event, {
  foreignKey: { field: "websiteId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Event.belongsTo(Website, {
  foreignKey: { field: "websiteId", allowNull: false },
});
module.exports = Event;
