// models/Product.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
    },
    brand: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    subcategory: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: false,
  },
);


module.exports = Product;
