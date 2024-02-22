const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const adminAddCollab = require("../controllers/adminAddCollab");

router.post("/", registerController.handleNewUser);
router.post("/collab", adminAddCollab.newCollab);

module.exports = router;
