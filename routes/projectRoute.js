const express = require("express");
const router = express.Router();

// 한 개의 프로젝트 관리
const project = require("../applications/projects/eachProjectController.js");

// 새로운 프로젝트 생성
router.post("/project", project.create);
// 새로운 프로젝트 생성 시, api키 값 생성
router.get("/project/key", project.getkey);

// 프로젝트 id 값으로 해당 프로젝트의 간단한 정보 반환 (work space 위에 기본정보 표시)
router.get("/project/:id", project.read);

// 프로젝트 삭제
router.delete("/project/:id", project.delete);

// 프로젝트 정보 업데이트
router.put("/project/:id", project.update);


// 여러 프로젝트 관리
const projects = require("../applications/projects/allProjectsController.js");

// 프로젝트 6개씩 정보 반환 (my page에서 프로젝트 카드에 사용)
router.get("/project", projects.card);

// 모든 프로젝트 이름과 총 프로젝트 갯수 반환
router.get("/projects/list", projects.list);

module.exports = router;
