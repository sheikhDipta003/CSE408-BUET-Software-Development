// models/Spec.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");

const Spec = sequelize.define(
  "Spec",
  {
    specId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    specTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

Product.belongsToMany(Spec, {
  through: ProductSpec,
  foreignKey: { field: "productId", allowNull: false },
});
Spec.belongsToMany(Product, {
  through: ProductSpec,
  foreignKey: { field: "specId", allowNull: false },
});
Product.hasMany(ProductSpec, {
  foreignKey: { field: "productId", allowNull: false },
});
ProductSpec.belongsTo(Product, {
  foreignKey: { field: "productId", allowNull: false },
});
Spec.hasMany(ProductSpec, {
  foreignKey: { field: "specId", allowNull: false },
});
ProductSpec.belongsTo(Spec, {
  foreignKey: { field: "specId", allowNull: false },
});

module.exports = Spec;
