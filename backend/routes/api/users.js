const express = require("express");
const router = express.Router();
const profile = require("../../controllers/userController");
const wishlist = require("../../controllers/userWishlistController");
const notif = require("../../controllers/userNotifController");
const review = require("../../controllers/reviewController");
const pricedrop = require("../../controllers/priceDropController");
const event = require("../../controllers/eventController");
const uservoucher = require("../../controllers/userVoucherController");
const recommend = require("../../controllers/recommendController");
const ROLES_LIST = require("../../config/roles");
const verifyRole = require("../../middleware/verifyRole");

// get all reviews
router.get("/reviews", review.getAllReviews);
router.get("/recommend2", recommend.getAllUserClickcount);
router.get("/trending", recommend.getTrendingProducts);

//profile
router.get("/:userId", profile.getUser);
router.put("/:userId/update", profile.updateUser);
router.get("/:userId/delete", profile.deleteUser);

//wishlist
router.get("/:userId/wishlist", wishlist.allWishlist);
router.get("/:userId/wishlist/:pwId", wishlist.getOneWishItem);
router.post("/:userId/wishlist/:pwId/add", wishlist.addToWishlist);
router.get("/:userId/wishlist/:wishlistId/delete", wishlist.deleteWishItem);

//notifications
router.get("/:userId/notification", notif.getAllNotifications);
router.get("/:userId/notification/:notifId/mark", notif.markAsRead);
router.get("/:userId/notification/:notifId/delete", notif.deleteNotification);

//reviews
router.get("/:userId/reviews", review.getUserReviews);
router.post("/:userId/reviews", review.createReview);
router.get("/:userId/reviews/:reviewId", review.getReviewById);
router.get("/:userId/reviews/:reviewId/edit", review.updateReview);
router.get("/:userId/reviews/:reviewId/delete", review.deleteReview);

//price-drop alerts
router.route("/:userId/alerts/pricedrop").post(verifyRole(ROLES_LIST.User), pricedrop.setPriceDropAlert);
router.get("/:userId/alerts/pricedrop", pricedrop.viewPriceDropAlerts);
router.put("/:userId/alerts/pricedrop/update", pricedrop.updatePriceDrop);
router.delete("/:userId/alerts/pricedrop/delete/:productId/:websiteId", pricedrop.removePriceDropAlert);

// vouchers
router.get("/:userId/vouchers", uservoucher.getUserVouchers);
router.delete(
  "/:userId/vouchers/:voucherId/remove",
  uservoucher.removeUserVoucher,
  );

// view all events organized by all websites or a specific event details
router.get("/:userId/events", event.getUserEvents);
router.delete("/:userId/events/:eId/unfollow", event.unfollowEvent);
router.get("/:userId/upcomingevents", event.getUpcomingEvents);
router.get("/:userId/upcomingevents/:eId/follow", event.followEvent);
  
// recommndations
router.get("/:userId/recommend", recommend.generateRecommendations);
router.post("/:userId/clicks", recommend.getClicksCount);
router.get("/:userId/clicks/all", recommend.getAllClickCounts);
router.get("/:userId/:pwId/clicks/create", recommend.createClicksCount);
router.put("/:userId/clicks/update", recommend.updateClicksCount);

module.exports = router;
