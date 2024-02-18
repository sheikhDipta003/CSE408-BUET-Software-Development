const User = require("../models/User"); // Import the User model
const validator = require("email-validator");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error getting user" });
  }
};

const updateUser = async (req, res) => {
  console.log("inside updateUser");
  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const userId = req.params.userId;
  const { username, email, password } = req.body;

  if (!USER_REGEX.test(username) || !PWD_REGEX.test(password) || !validator.validate(email))
    return res
      .status(400)
      .json({ message: "This username, email and/or password is not acceptable." });

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user attributes
    const hashedPwd = await bcrypt.hash(password, 10);
    user.username = username;
    user.email = email;
    user.password = hashedPwd;
    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

module.exports = { getUser, updateUser, deleteUser };
