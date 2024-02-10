// models/Spec.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");

const ProductSpec = sequelize.define(
  "ProductSpec",
  {
    psId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    specName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);


ProductSpec.belongsTo(Product, {
  foreignKey: { field: "productId", allowNull: false },
});
Product.hasMany(ProductSpec, {

  foreignKey: { field: "productId", allowNull: false },
});

module.exports = ProductSpec;

