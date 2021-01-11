const express = require("express");
const router = express.Router();

const run = require("../applications/runs/controllers/runController.js");
const runCard = require("../applications/runs/controllers/runCardController.js");
//sdk 실행시 모델 생성.
router.post("/run", run.create);
// mypage에서 runCard 불러옴 10개씩
router.get("/run", runCard.read);

// workspace에서 프로젝트 id에 따라 불러오기
router.get("/run/:id", run.read);

// run id로 run 삭제
router.delete("/run/:id", run.delete);

// run id로 run 이름 업데이트
router.put("/run/:id", run.update);

module.exports = router;
