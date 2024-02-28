// models/UserVoucher.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Voucher = require("./Voucher");

const UserVoucher = sequelize.define(
  "UserVoucher",
  {
    // Foreign keys
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "userId",
      },
    },
    voucherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Voucher",
        key: "voucherId",
      },
    },
    dateAdded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  },
);

User.belongsToMany(Voucher, {
  through: UserVoucher,
  foreignKey: { field: "userId", allowNull: false },
});
Voucher.belongsToMany(User, {
  through: UserVoucher,
  foreignKey: { field: "voucherId", allowNull: false },
});
User.hasMany(UserVoucher, {
  foreignKey: { field: "userId", allowNull: false },
});
Voucher.hasMany(UserVoucher, {
  foreignKey: { field: "voucherId", allowNull: false },
});
UserVoucher.belongsTo(User, {
  foreignKey: { field: "userId", allowNull: false },
});
UserVoucher.belongsTo(Voucher, {
  foreignKey: { field: "voucherId", allowNull: false },
});

module.exports = UserVoucher;
