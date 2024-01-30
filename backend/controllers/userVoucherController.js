const Voucher = require("../models/Voucher");
const UserVoucher = require("../models/UserVoucher");
const Website = require("../models/Website");

async function getUserVouchers(req, res) {
  const { userId } = req.params;

  try {
    // Retrieve all voucherIds associated with the userId from UserVoucher table
    const userVouchers = await UserVoucher.findAll({
      where: { userId: userId },
    });

    // Extract voucherIds from the userVouchers
    const voucherIds = userVouchers.map((userVoucher) => userVoucher.voucherId);

    // Retrieve voucher details from the Voucher table based on voucherIds
    const vouchers = await Voucher.findAll({
      where: { voucherId: voucherIds },
    });

    // Extract websiteIds from the retrieved vouchers
    const websiteIds = vouchers.map((voucher) => voucher.websiteId);

    // Retrieve website names from the Website table based on websiteIds
    const websites = await Website.findAll({
      where: { websiteId: websiteIds },
    });

    // Construct the response data including voucher details and website names
    const userVoucherDetails = vouchers.map((voucher) => {
      const website = websites.find(
        (site) => site.websiteId === voucher.websiteId,
      );
      return {
        voucherId: voucher.voucherId,
        voucherCode: voucher.voucherCode,
        discountPercentage: voucher.discountPercentage,
        maxAmountForDiscount: voucher.maxAmountForDiscount,
        minAmountForDiscount: voucher.minAmountForDiscount,
        endDate: voucher.endDate,
        websiteName: website ? website.name : "Unknown Website",
      };
    });

    // Send the response with the user's voucher details
    res.json(userVoucherDetails);
  } catch (error) {
    console.error("Error fetching user vouchers:", error);
    res.status(500).json({ message: "Failed to fetch user vouchers" });
  }
}

async function removeUserVoucher(req, res) {
  const { userId, voucherId } = req.params;

  try {
    // Delete the record from the UserVoucher table corresponding to the userId and voucherId
    const deletedVoucher = await UserVoucher.destroy({
      where: {
        userId: userId,
        voucherId: voucherId,
      },
    });

    if (deletedVoucher > 0) {
      // Voucher successfully removed
      res.json({ message: "Voucher removed successfully" });
    } else {
      // No matching record found to delete
      res.status(404).json({
        message: "No voucher found with the provided userId and voucherId",
      });
    }
  } catch (error) {
    console.error("Error removing user voucher:", error);
    res.status(500).json({ message: "Failed to remove user voucher" });
  }
}

module.exports = {
  getUserVouchers,
  removeUserVoucher,
};
