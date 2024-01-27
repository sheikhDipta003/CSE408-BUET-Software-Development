const express = require('express');
const router = express.Router();
const adminUserControl = require('../../controllers/adminUserController');
const adminVoucherControl = require('../../controllers/adminVoucherController');

//manage users
router.get('/users/:userId/delete', adminUserControl.deleteUser);
router.get('/users/:userId', adminUserControl.getOneUser);
router.get('/users', adminUserControl.getUsers);

//manage vouchers
router.post('/vouchers/add', adminVoucherControl.addVoucher);
router.get('/vouchers/:voucherId', adminVoucherControl.viewOneVoucher);
router.get('/vouchers', adminVoucherControl.viewAllVouchers);
router.get('/vouchers/:voucherId/delete', adminVoucherControl.deleteVoucher);

module.exports = router;