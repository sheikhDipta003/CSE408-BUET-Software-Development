const express = require("express");
const router = express.Router();
const collController = require("../../controllers/collController");

router.post("/event/add", collController.addEvent);
router.get("/:collabId/events", collController.getAllEvents);
router.delete("/:collabId/events/:eventId/remove", collController.removeEvent);

router.post("/voucher/add", collController.addVoucher);
router.get("/:collabId/vouchers", collController.getAllVouchers);
router.delete("/:collabId/vouchers/:voucherId/remove", collController.removeVoucher);

router.get("/:collabId", productsController.getProductsByCollabId);
router.post("/:collabId/promote", recommendController.generateTopProducts);

module.exports = router;
