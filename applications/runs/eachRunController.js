const knex = require("../../db/knex");

let eachRunController = {};

// run 소유자와 token 소유자가 같은지 확인
const checkAuth = async (param, accessId) => {
  return knex("run")
    .where("run.runId", param)
    .select("project.userId")
    .leftJoin("project", "project.projectId", "run.projectId")
    .then(run => {
      if( Object.keys(run).length==0 ){
        console.log("없는 런입니다.");
        return 2;
      }
      if( run[0].userId !== accessId )
        return 0;
      return 1;
    })
}

// 프로젝트 id 값으로 해당 프로젝트에 속한 런들의 기본 정보 반환 (work space 표에 기본정보 표시)
eachRunController.read = function (req, res) {
  knex("run")
    .select()
    .where({
      "run.projectId": req.params.id,
      "step.stepNumber": 1,
    })
    .leftJoin("step", "run.runId", "step.runId")
    .then((runList) => {
      res.json(runList);
    });
};

eachRunController.graph = async (req, res) => {
  var runid = req.params.id;

  const isAuthor = await checkAuth(runid, res.locals.userId);

  if (isAuthor === 2)
    return res.status(404).json({ error: "no run"}); // 상태코드 수정 필요
  else if(!isAuthor) 
    return res.status(401).json({ error: "unauthorized"});
  else {
    knex
      .select("stepNumber", "indicator", "system")
      .from("step")
      .where({ runId: runid })
      .then((result) => {
        res.end(JSON.stringify(result));
      });
  }
};

eachRunController.delete = async (req, res) => {
  const isAuthor = await checkAuth(req.params.id, res.locals.userId);

  if (isAuthor === 2)
    return res.status(404).json({ error: "no run"}); // 상태코드 수정 필요
  else if(!isAuthor) 
    return res.status(401).json({ error: "unauthorized"});
  else {
    knex("run")
      .where("runId", req.params.id)
      .del()
      .then(() => {
        res.end("A run is deleted");
      });
  }
};

eachRunController.update = async (req, res) => {
  const isAuthor = await checkAuth(req.params.id, res.locals.userId);

  if (isAuthor === 2)
    return res.status(404).json({ error: "no run"}); // 상태코드 수정 필요
  else if(!isAuthor) 
    return res.status(401).json({ error: "unauthorized"});
  else {
    knex("run")
      .where("runId", req.params.id)
      .update({
        runName: req.body.params.runName,
      })
      .then(() => {
        res.end("A run is updated");
      });
  }
};

module.exports = eachRunController;
