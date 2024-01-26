const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  adminId: {
    type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // This field is required
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // This field is required
    unique: true, // Ensures the email is unique in the database
    validate: {
      isEmail: true, // Validates that the value is an email address
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // This field is required
  },
  refreshToken: {
    type: DataTypes.STRING,
  }
});

module.exports = Admin;