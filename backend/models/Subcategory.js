const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");
const Brand = require("./Brand");

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
Brand.hasMany(Subcategory, {
  foreignKey: { field: "subcategoryId", allowNull: false },
});
Subcategory.belongsTo(Brand, {
  foreignKey: { field: "subcategoryId", allowNull: false },
});

module.exports = Subcategory;
