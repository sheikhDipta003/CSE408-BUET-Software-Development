const express = require("express");
const router = express.Router();
const adminUserControl = require("../../controllers/adminUserController");
const adminVoucherControl = require("../../controllers/adminVoucherController");
const adminWebsiteController = require("../../controllers/adminWebsiteController");
const reviewController = require("../../controllers/reviewController");
const adminEventController = require("../../controllers/adminEventController");
const adminProfileController = require("../../controllers/adminProfileController");
const adminAddCollab = require("../../controllers/adminAddCollab");

router.post("/registerCollab", adminAddCollab.newCollab);
router.post("/registerAdmin", adminAddCollab.newAdmin);

//manage reviews
router.get("/rating", reviewController.getWeightedRating);
router.get("/reviews", reviewController.getUnapprovedReviews);
router.put("/reviews/:reviewId/approve", reviewController.approveReview);
router.delete("/reviews/:reviewId/delete", reviewController.deleteReview);

router.get("/collabs", adminUserControl.getCollabs);

//manage users
router.get("/users", adminUserControl.getUsers);
router.get("/users/:userId", adminUserControl.getOneUser);
router.post("/users/:userId/notify", adminUserControl.createNotification);
router.get("/users/:userId/delete", adminUserControl.deleteUser);

//manage vouchers
router.get("/vouchers", adminVoucherControl.viewAllVouchers);
router.get("/vouchers/:voucherId", adminVoucherControl.viewOneVoucher);
router.get("/vouchers/:voucherId/delete", adminVoucherControl.deleteVoucher);

//manage websites
router.get("/websites", adminWebsiteController.viewAllWebsites);
router.post("/websites/add", adminWebsiteController.addWebsite);
router.get("/websites/:websiteId/delete", adminWebsiteController.deleteWebsite);
router.put("/websites/:websiteId/update", adminWebsiteController.updateWebsite);

/*
    manage events
*/
// Get all events
router.get("/events", adminEventController.getAllEvents);

// Get a specific event by event_id
router.get("/events/:eventId", adminEventController.getEventById);

// Add a new event
//router.post("/events/add", adminEventController.addEvent);

router.put("/events/:eId/approve", adminEventController.approveEvent);
router.delete("/events/:eId/delete", adminEventController.removeEvent);

/*
    manage profile
*/

// Get admin profile by admin_id
router.get("/:adminId/profile", adminProfileController.getAdminProfile);

// Update admin profile by admin_id
router.put("/:adminId/profile/updateprofile", adminProfileController.updateAdminProfile);

module.exports = router;
