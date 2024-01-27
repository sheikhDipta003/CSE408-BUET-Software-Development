const express = require('express');
const router = express.Router();
const wishlist = require('../../controllers/userWishlistController');
const notif = require('../../controllers/userNotifController');

//wishlist
router.get('/:userId/wishlist/:wishlistId/delete', wishlist.deleteWishItem);
router.get('/:userId/wishlist/:wishlistId', wishlist.getOneWishItem)
router.get('/:userId/wishlist', wishlist.allWishlist);

//notifications
router.get('/:userId/notification', notif.getAllNotifications);
router.get('/:userId/notification/:notifId/mark', notif.markAsRead);
router.get('/:userId/notification/:notifId/delete', notif.deleteNotification);

module.exports = router;
