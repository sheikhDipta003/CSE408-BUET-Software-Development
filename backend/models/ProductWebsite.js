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
    shippingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    pwURL: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
      }
    },
    price: {
      type: DataTypes.NUMBER,
      validate: {
        min: 0.00,
      }
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

//either add foreign key fields which will only act as foreign key and will add own primary key
//or do the following to make composite key without any primary key
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
