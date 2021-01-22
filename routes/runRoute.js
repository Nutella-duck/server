const express = require("express");
const router = express.Router();

const run = require("../applications/runs/eachRunController.js");

// 프로젝트 id 값으로 해당 프로젝트에 속한 런들의 기본 정보 반환 (work space 표에 기본정보 표시)
router.get("/run/:id", run.read);

// 런 id로 해당 런의 indicator와 system 정보 반환 (그래프에 사용)
router.get("/graph/:id", run.graph);

// 런 id로 run 삭제
router.delete("/run/:id", run.delete);

// 런 id로 run 이름 업데이트
router.put("/run/:id", run.update);


const runs = require("../applications/runs/allRunsController.js");

// 런 10개씩 정보 반환 (my page에서 런 카드에 사용)
router.get("/run", runs.card);

module.exports = router;
