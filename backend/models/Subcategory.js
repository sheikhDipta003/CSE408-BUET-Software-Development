const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");
const Product = require("./Product");

const Subcategory = sequelize.define("Subcategory", {
  subcategoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subcategoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Category.hasMany(Subcategory, {
  foreignKey: { field: "categoryId", allowNull: false },
});
Subcategory.belongsTo(Category, {
  foreignKey: { field: "categoryId", allowNull: false },
});
Subcategory.hasMany(Product, {
  foreignKey: { field: "subcategoryId", allowNull: false },
});
Product.belongsTo(Subcategory, {
  foreignKey: { field: "subcategoryId", allowNull: false },
});

module.exports = Subcategory;
