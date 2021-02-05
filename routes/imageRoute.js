const express = require("express");
const router = express.Router();

// 한 개의 프로젝트 관리
const profileImage = require("../applications/imageController.js");

router.post('/upload', profileImage.uploadImage);
// 새로운 프로젝트 생성


module.exports = router;
