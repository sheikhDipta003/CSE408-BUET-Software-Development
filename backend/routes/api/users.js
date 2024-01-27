const express = require('express');
const router = express.Router();
const wishlist = require('../../controllers/userWishlistController');
const profile = require('../../controllers/userProfileController');
//const notif = require('../../controllers/userNotifController');

router.get('/:userId/wishlist/:wishlistId/delete', wishlist.deleteWishItem);
router.get('/:userId/wishlist/:wishlistId', wishlist.getOneWishItem)
router.get('/:userId/wishlist', wishlist.allWishlist);
// router.get('/:userId/profile');
// router.get('')

module.exports = router;