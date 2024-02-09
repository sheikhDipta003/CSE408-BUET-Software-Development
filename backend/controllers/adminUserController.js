const User = require("../models/User");
const Notification = require("../models/Notification");

const getUsers = async (req, res) => {
  try {
    // Fetch the list of users from the database
    const users = await User.findAll({
      where: { roles: ["User", "Collaborator"] },
      attributes: ["userId", "username", "email", "roles", "registrationDate"],
    });

    const totalUsers = await User.count({
      where: { roles: ["User"] }
    });

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOneUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch the list of users from the database
    const user = await User.findOne({
      where: { userId: userId },
      attributes: ["userId", "username", "email", "roles", "registrationDate"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error retrieving user: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint to delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, message, isRead } = req.body;

    const notification = await Notification.create({
      title,
      message,
      isRead,
      UserUserId: userId
    });

    res.status(201).json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { getUsers, deleteUser, getOneUser, createNotification };
