const Voucher = require("../models/Voucher");
const Website = require("../models/Website");
const Event = require("../models/Event");


const addVoucher = async (req, res) => {
  try {
    // Extract voucher details from the request body
    const {
      collabId,
      voucherCode,
      discountPercentage,
      maxAmount,
      minAmount,
      startDate,
      endDate,
      total
    } = req.body;

    const website = await Website.findOne({
      where:
      {
        collabId: collabId,
      }
    })

    const websiteId=website.websiteId;

    // Create a new voucher in the database
    const newVoucher = await Voucher.create({
      websiteId: websiteId,
      voucherCode: voucherCode,
      discountPercentage: discountPercentage,
      maxAmount: maxAmount,
      minAmount: minAmount,
      startDate: startDate,
      endDate: endDate,
      total: total
    });

    res.status(201).json({ newVoucher });
  } catch (error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateVoucher = async (req, res) => {
  try {

  }catch(error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteVoucher = async (req, res) => {
  try {

  }catch(error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const addEvent = async (req, res) => {
  try {

  }
  catch(error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEvent = async (req, res) => {
  try{

  }catch(error) {
    console.error("Error adding voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addVoucher, addEvent };
