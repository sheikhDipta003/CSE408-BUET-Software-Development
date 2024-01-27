// models/Website.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
//const ProductWebsite = require('./ProductWebsite');

const Website = sequelize.define('Website', {
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
}, 
{
  timestamps: false,
});

//Website.belongsToMany(Product, { through: ProductWebsite });
//Website.hasMany(Voucher);
module.exports = Website;
