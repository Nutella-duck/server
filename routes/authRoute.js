const express = require("express");
const router = express.Router();

const authController = require("../applications/auth/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
