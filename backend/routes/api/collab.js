const express = require("express");
const router = express.Router();
const collController = require("../../controllers/collController");
const productsController = require("../../controllers/productsController");
const recommendController = require("../../controllers/recommendController");

router.get("/:collabId/profile", collController.getCollabProfile);

router.post("/event/add", collController.addEvent);

router.post("/voucher/add", collController.addVoucher);
router.post("/voucher/assign2/:voucherId", collController.assignToRandomUsers);
router.get("/voucher/assign/:userId/:voucherId", collController.assignVoucherToUser);

router.get("/:collabId/events", collController.getAllEvents);
router.put("/:collabId/events/:eId/update", collController.updateEvent);
router.delete("/:collabId/events/:eventId/remove", collController.removeEvent);
router.get("/:collabId/voucher/count/:userId", collController.getNumberOfUserVouchers);

router.get("/:collabId/clickcounts", collController.getClickCounts);
router.get("/:collabId/vouchers", collController.getAllVouchers);
router.delete("/:collabId/vouchers/:voucherId/remove", collController.removeVoucher);

router.get("/:collabId/products", collController.getAllProducts);
router.post("/:collabId/promote", recommendController.generateTopProducts);
router.post("/:collabId/unpromote", recommendController.removeTopProduct);

module.exports = router;
