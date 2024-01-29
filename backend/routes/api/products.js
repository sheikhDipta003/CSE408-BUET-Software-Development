const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const priceDropController = require('../../controllers/priceDropController');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middleware/verifyRole');

router.get('/', productsController.getProductsByCategoryAndSubcategory);
router.post('/details/alerts/pricedrop', priceDropController.setPriceDropAlert);
router.get('/:productId', productsController.getProductDetails);
router.get('/:productId/:websiteId', productsController.getProductWebsite);

module.exports = router;
