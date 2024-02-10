// models/Spec.js
const sequelize = require("../config/database");

const ProductSpec = sequelize.define(
  "ProductSpec",
  {
    psId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = ProductSpec;
