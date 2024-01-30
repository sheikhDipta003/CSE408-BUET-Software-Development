const Voucher = require("../models/Voucher");
const addVoucher = async (req, res) => {
  try {
    // Extract voucher details from the request body
    const {
      websiteId,
      voucherCode,
      discountPercentage,
      maxAmount,
      minAmount,
      endDate,
    } = req.body;

    // Create a new voucher in the database
    const newVoucher = await Voucher.create({
      websiteId: websiteId,
      voucherCode: voucherCode,
      discountPercentage: discountPercentage,
      maxAmount: maxAmount,
      minAmount: minAmount,
      endDate: endDate,
    });

    res.status(201).json({ newVoucher });
  } catch (error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addVoucher };
