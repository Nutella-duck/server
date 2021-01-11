const express = require("express");
const router = express.Router();

const project = require("../applications/projects/controllers/projectController.js");
const projectcard = require("../applications/projects/controllers/projectCardController.js");
const projectlist = require("../applications/projects/controllers/projectListController.js");

// 프로젝트 생성 시 정보 받음
router.post("/project", project.create);

// 프로젝트 생성 시 키 값 생성
router.get("/project/key", project.getkey);

// work space에서 프로젝트 정보 받아올 때, 기본 프로젝트 한 개 정보
router.get("/project/:id", project.read);

// 프로젝트 삭제
router.delete("/project/:id", project.delete);

// 프로젝트 정보 업데이트
router.put("/project/:id", project.update);

// my space에서 카드 6개씩 읽어올 때
router.get("/project", projectcard.read);

// 모든 프로젝트 이름과 총 프로젝트 갯수
router.get("/projects/list", projectlist.read);

module.exports = router;
