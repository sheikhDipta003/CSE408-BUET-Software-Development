const express = require("express");
const router = express.Router();
const adminWebsiteController = require("../../controllers/adminWebsiteController");

router.get("/all", adminWebsiteController.viewAllWebsites);

module.exports=router;