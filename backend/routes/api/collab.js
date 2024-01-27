const express = require('express');
const router = express.Router();
const collVoucherControl = require('../../controllers/collVoucherController');

router.post('/vouchers/add', collVoucherControl.addVoucher);

module.exports = router;