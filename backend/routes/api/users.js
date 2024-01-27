const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/userController');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middleware/verifyRole');

router.get('/:userId', UserController.getUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

// router.route('/:userId')
//     .get(verifyRoles(ROLES_LIST.User), UserController.getUser);
// router.route('/:userId')
//     .put(verifyRoles(ROLES_LIST.User), UserController.updateUser);
// router.route('/:userId')
//     .delete(verifyRoles(ROLES_LIST.User), UserController.deleteUser);


module.exports = router;
