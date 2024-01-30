// models/Product.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Brand = require("./Brand");

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
  },
  {
    timestamps: false,
  },
);

Product.belongsTo(Brand, {
  foreignKey: { field: "brandId", allowNull: false },
});
Brand.hasMany(Product, {
  foreignKey: { field: "brandId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Product;
