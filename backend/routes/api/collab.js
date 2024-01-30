const express = require("express");
const router = express.Router();
const collVoucherControl = require("../../controllers/collVoucherController");
const adminVoucher = require("../../controllers/adminVoucherController");

router.get("/vouchers", adminVoucher.viewAllVouchers);
router.get("/vouchers/:voucherId", adminVoucher.viewOneVoucher);
router.get("/vouchers/:voucherId/delete", adminVoucher.deleteVoucher);
router.post("/vouchers/add", collVoucherControl.addVoucher);

module.exports = router;
