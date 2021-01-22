const express = require("express");
const router = express.Router();

const userController = require("../applications/user/userController");

// 현재 유저의 기본 정보 반환 (My page에서 프로필 사진 옆에 사용)
router.get("/user", userController.read);

module.exports = router;
