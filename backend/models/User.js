const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  username: {
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
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Set the default value to the current timestamp
  },
  roles: {
    type: DataTypes.ENUM('User', 'Admin', 'Collaborator'),
    defaultValue: 'User',
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
  }
}, 
{
  timestamps: false,
});
//User.belongsToMany(Voucher, { through: UserVoucher });
//User.hasMany(Wishlist);
module.exports = User;