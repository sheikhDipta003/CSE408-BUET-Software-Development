const Admin = require("../models/User");

// Get admin profile by admin_id
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Return admin profile data without sensitive information
    res.status(200).json({
      adminId: admin.adminId,
      username: admin.username,
      email: admin.email,
      // Add other profile fields as needed
    });
  } catch (error) {
    console.error("Error retrieving admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update admin profile by admin_id
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { username, email } = req.body;

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update admin profile fields
    admin.username = username;
    admin.email = email;
    // Add other profile fields as needed

    // Save the updated admin profile
    await admin.save();

    res.status(200).json({ message: "Admin profile updated successfully", admin });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAdminProfile, updateAdminProfile };
