const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Brand = sequelize.define("Brand", {
  brandId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brandName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Brand;
