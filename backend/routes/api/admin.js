const express = require('express');
const router = express.Router();
const adminUserControl = require('../../controllers/adminUserController');

router.get('/users/:userId/delete', adminUserControl.deleteUser);
router.get('/users/:userId', adminUserControl.getOneUser);
router.get('/users', adminUserControl.getUsers);

module.exports = router;