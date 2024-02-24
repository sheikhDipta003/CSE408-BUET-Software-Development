const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
  "Review",
  {
    reviewId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = Review;
