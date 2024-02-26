const express = require("express");
const router = express.Router();
const collVoucherControl = require("../../controllers/collVoucherController");
const productsController = require("../../controllers/productsController");
const recommendController = require("../../controllers/recommendController");
const adminVoucher = require("../../controllers/adminVoucherController");

router.get("/vouchers", adminVoucher.viewAllVouchers);
router.get("/vouchers/:voucherId", adminVoucher.viewOneVoucher);
router.get("/vouchers/:voucherId/delete", adminVoucher.deleteVoucher);
router.post("/vouchers/add", collVoucherControl.addVoucher);

router.get("/:collabId", productsController.getProductsByCollabId);
router.post("/:collabId/promote", recommendController.generateTopProducts);

module.exports = router;
