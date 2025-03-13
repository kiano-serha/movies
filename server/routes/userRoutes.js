const express = require("express");
const { addRating, getRatings } = require("../controllers/userController");
const router = express.Router();

router.post("/add/rating", addRating);
router.get("/ratings", getRatings);

module.exports = router;
