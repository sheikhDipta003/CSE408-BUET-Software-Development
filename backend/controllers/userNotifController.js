const User = require("../models/User");
const Notification = require("../models/Notification");

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all notifications for the user
    const notifications = await Notification.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint to mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notificationId = req.params.notifId;

    // Check if the notification belongs to the user
    const notification = await Notification.findOne({
      where: { notifId: notificationId, userId: userId },
    });

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found for the user" });
    }

    // Mark the notification as read
    notification.isRead = true;
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification marked as read successfully" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Endpoint to delete a notification
const deleteNotification = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notificationId = req.params.notifId;

    // Check if the notification belongs to the user
    const notif = await Notification.findOne({
      where: { notifId: notificationId, userId: userId },
    });

    if (!notif) {
      return res
        .status(404)
        .json({ message: "Notification not found for the user" });
    }

    await notif.destroy();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllNotifications, markAsRead, deleteNotification };
