const knex = require("../../db/knex");
var generateSafeId = require("generate-safe-id");
const { select } = require("../../db/knex");

let projectController = {};

// 새로운 프로젝트 생성
projectController.create = function (req, res) {
  knex("project")
    .insert({
      userId: res.locals.userId,
      projectName: req.body.params.projectName,
      description: req.body.params.description,
      privacy: req.body.params.privacy || 1,
      apiKey: req.body.params.apiKey,
    })
    .then(() => {
      res.send("A project is created");
    });
};
// 새로운 프로젝트 생성 시, api키 값 생성
projectController.getkey = function (req, res) {
  res.send(generateSafeId());
};

// 파라미터로 받은 id가 현재 사용자 id와 일치하는지 반환
const checkAuth = async (param, id) => {
  return knex("project")
    .where("projectId", param)
    .select("userId")
    .then(project => {
      if( Object.keys(project).length==0 ){
        console.log("없는 프로젝트입니다.");
        return 2;
      }
      if( project[0].userId !== id )
        return 0;
      return 1;
    })
}

// 프로젝트 id 값으로 해당 프로젝트의 간단한 정보 반환 (work space 위에 기본정보 표시)
projectController.read = async (req, res) => {
  const isAuthor = await checkAuth(req.params.id, res.locals.userId );

  if (isAuthor === 2)
    return res.status(404).json({ error: "no project"}); // 상태코드 수정 필요
  else if(!isAuthor) 
    return res.status(401).json({ error: "unauthorized"});
  else {
    knex("project")
      .where({ "project.projectId": req.params.id, "project.userId": res.locals.userId })
      .select("project.projectId", "project.projectName", function() {
        this.count("run.projectId").as("totalRun")
      })
      .leftJoin("run", "project.projectId", "run.projectId").as("results")
      .groupBy("project.projectId")
      .then((projectList) => {
        res.json(projectList);
    });
  }
};

projectController.delete = async (req, res) => {
  const isAuthor = await checkAuth(req.params.id, res.locals.userId );

  if (isAuthor === 2)
    return res.status(404).json({ error: "no project"}); // 상태코드 수정 필요
  else if(!isAuthor) 
    return res.status(401).json({ error: "unauthorized"});
  else {
    knex("project")
      .where({ "project.projectId": req.params.id, "project.userId": res.locals.userId })
      .del()
      .then(() => {
        res.end("A Project is deleted");
      });
  }
};

projectController.update = async (req, res) => {
  const isAuthor = await checkAuth(req.params.id, res.locals.userId );

  if (isAuthor === 2)
    return res.status(404).json({ error: "no project"}); // 상태코드 수정 필요
  else if(!isAuthor) 
    return res.status(401).json({ error: "unauthorized"});
  else {
    knex("project")
      .where({ "project.projectId": req.params.id, "project.userId": res.locals.userId })
      .update({
        description: req.body.params.description,
        projectName: req.body.params.projectName,
        privacy: req.body.params.privacy
      })
      .then(() => {
        res.end("A project is updated");
      });
  }
};

module.exports = projectController;