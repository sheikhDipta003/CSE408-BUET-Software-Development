// models/ProductPrice.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProductWebsite = require("./ProductWebsite");

const ProductPrice = sequelize.define(
  "ProductPrice",
  {
    prpId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

ProductWebsite.hasMany(ProductPrice, {
  foreignKey: { field: "pwId", allowNull: false },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProductPrice.belongsTo(ProductWebsite, {
  foreignKey: { field: "pwId", allowNull: false },
});
module.exports = ProductPrice;
