const express = require('express');
const router = express.Router();
const adminUserControl = require('../../controllers/adminUserController');
const adminVoucherControl = require('../../controllers/adminVoucherController');
const adminWebsiteController = require('../../controllers/adminWebsiteController');

//manage users
router.get('/users', adminUserControl.getUsers);
router.get('/users/:userId', adminUserControl.getOneUser);
router.get('/users/:userId/delete', adminUserControl.deleteUser);
-
//manage vouchers
router.get('/vouchers', adminVoucherControl.viewAllVouchers);
router.get('/vouchers/:voucherId', adminVoucherControl.viewOneVoucher);
router.get('/vouchers/:voucherId/delete', adminVoucherControl.deleteVoucher);

//manage websites
router.get('/websites', adminWebsiteController.viewAllWebsites);
router.post('/websites/add', adminWebsiteController.addWebsite);
router.get('/websites/:websiteId/delete', adminWebsiteController.deleteWebsite);
router.put('/websites/:websiteId/update', adminWebsiteController.updateWebsite)

module.exports = router;