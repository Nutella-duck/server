const express = require("express");
const router = express.Router();

const authController = require("../applications/auth/authController");
const registerController = require("../applications/auth/registerController");
const profileImage = require("../applications/auth/imageController.js");

router.post("/register", registerController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// 회원가입시 이미지 업로드를 위함
router.post('/upload', profileImage.uploadImage);

module.exports = router;
