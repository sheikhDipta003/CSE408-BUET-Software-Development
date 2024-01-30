const express = require('express');
const router = express.Router();
const profile = require('../../controllers/userController');
const wishlist = require('../../controllers/userWishlistController');
const notif = require('../../controllers/userNotifController');
const review = require('../../controllers/reviewController');
const pricedrop = require('../../controllers/priceDropController');
const event = require('../../controllers/eventController');
const uservoucher = require('../../controllers/userVoucherController');

// get all reviews
router.get('/reviews', review.getAllReviews);

// view all events organized by all websites
router.get('/events', event.getUserEvents);
router.get('/events/:eid', event.getEventDetails);

//profile
router.get('/:userId', profile.getUser);
router.put('/:userId/update', profile.updateUser);
router.get('/:userId/delete', profile.deleteUser);

//wishlist
router.get('/:userId/wishlist', wishlist.allWishlist);
router.get('/:userId/wishlist/:pwId', wishlist.getOneWishItem);
router.get('/:userId/wishlist/:pwId/delete', wishlist.deleteWishItem);

//notifications
router.get('/:userId/notification', notif.getAllNotifications);
router.get('/:userId/notification/:notifId/mark', notif.markAsRead);
router.get('/:userId/notification/:notifId/delete', notif.deleteNotification);

//reviews
router.get('/:userId/reviews', review.getUserReviews);
router.post('/:userId/reviews', review.createReview);
router.get('/:userId/reviews/:reviewId', review.getReviewById);
router.get('/:userId/reviews/:reviewId/edit', review.updateReview);
router.get('/:userId/reviews/:reviewId/delete', review.deleteReview);

//price-drop alerts
router.get('/:userId/alerts/pricedrop', pricedrop.viewPriceDropAlerts);
router.delete('/:userId/alerts/pricedrop', pricedrop.removePriceDropAlert);

// vouchers
router.get('/:userId/vouchers', uservoucher.getUserVouchers);
router.delete('/:userId/vouchers/:voucherId/remove', uservoucher.removeUserVoucher);


module.exports = router;
