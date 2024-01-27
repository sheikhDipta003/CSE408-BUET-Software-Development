const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middleware/verifyRole');

// Route for CRUD operations on all products
// router.route('/')
//     .post(verifyRoles(ROLES_LIST.User), productsController.createProduct);
// router.route('/:category/:subcategory')
//     .get(verifyRoles(ROLES_LIST.User), productsController.getProductsByCategoryAndSubcategory);
router.route('/')
    .post(productsController.createProduct);
router.route('/:category/:subcategory')
    .get(productsController.getProductsByCategoryAndSubcategory);

module.exports = router;
