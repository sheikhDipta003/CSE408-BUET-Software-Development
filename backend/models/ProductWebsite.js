// models/ProductWebsite.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");
const Website = require("./Website");

const ProductWebsite = sequelize.define(
  "ProductWebsite",
  {
    pwId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pwURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    instock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

Product.belongsToMany(Website, {
  through: ProductWebsite,
  foreignKey: { field: "productId", allowNull: false },
});
Website.belongsToMany(Product, {
  through: ProductWebsite,
  foreignKey: { field: "websiteId", allowNull: false },
});
Product.hasMany(ProductWebsite, {
  foreignKey: { field: "productId", allowNull: false },
});
ProductWebsite.belongsTo(Product, {
  foreignKey: { field: "productId", allowNull: false },
});
Website.hasMany(ProductWebsite, {
  foreignKey: { field: "websiteId", allowNull: false },
});
ProductWebsite.belongsTo(Website, {
  foreignKey: { field: "websiteId", allowNull: false },
});

module.exports = ProductWebsite;
