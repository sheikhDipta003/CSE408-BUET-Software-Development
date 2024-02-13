const express = require("express");
const router = express.Router();
const path = require("path");
const rootController = require("../controllers/rootController");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// get all reviews
router.get("/reviews", rootController.getAllReviews);
router.get("/events/:eId", rootController.getEventDetails);

module.exports = router;
