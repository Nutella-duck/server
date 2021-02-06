const express = require("express");
const router = express.Router();

const authController = require("../applications/auth/authController");
const registerController = require("../applications/auth/registerController");

router.post("/register", registerController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
