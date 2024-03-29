// models/Website.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
//const ProductWebsite = require('./ProductWebsite');
const User = require("./User");

const Website = sequelize.define(
  "Website",
  {
    websiteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true, // Adjust as needed
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUrl: true, // Validate that the value is a URL
      },
    },
    collaboration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default value if not provided
    },
    collabId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: "User",
        key: "userId",
      },
    },
  },
  {
    timestamps: false,
  },
);

//Website.belongsToMany(Product, { through: ProductWebsite });
//Website.hasMany(Voucher);
User.hasOne(Website,  {
  foreignKey: { field: "collabId", allowNull: true },
});
Website.belongsTo(User,  {
  foreignKey: { field: "collabId", allowNull: true },
})
module.exports = Website;
