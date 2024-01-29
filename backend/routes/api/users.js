const express = require('express');
const router = express.Router();
const profile = require('../../controllers/userController');
const wishlist = require('../../controllers/userWishlistController');
const notif = require('../../controllers/userNotifController');
const review = require('../../controllers/reviewController');

// get all reviews
router.get('/reviews', review.getAllReviews);

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

module.exports = router;
