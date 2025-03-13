const express = require("express");
const {
  register,
  verifyEmail,
  login,
  logout,
} = require("../controllers/authController");
const verifyUser = require("../services/verifyUser");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify/email/:token", verifyEmail);
router.post("/logout", verifyUser, logout);

module.exports = router;
