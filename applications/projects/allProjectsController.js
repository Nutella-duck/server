const knex = require("../../db/knex");
const { subscribe } = require("../../routes/runRoute");

let allProjectsController = {};

// 프로젝트 6개씩 정보 반환 (my page에서 프로젝트 카드에 사용)
allProjectsController.card = function (req, res) {
  let pageNum = req.query.page;
  let offset = pageNum > 1 ? 6 * (pageNum - 1) : 0;

  knex("project")
    .select(
      "project.projectId",
      "project.projectName",
      "project.description",
      "project.privacy",
      function () {
        this.count("run.projectId").as("totalRun");
      }
    )
    .where("project.userId", res.locals.userId)
    .leftJoin("run", "project.projectId", "run.projectId")
    .as("results")
    .groupBy("project.projectId")
    .limit(6)
    .offset(offset)
    .then((projectCardList) => {
      res.json(projectCardList);
    });
};

// 모든 프로젝트 이름과 총 프로젝트 갯수 반환
allProjectsController.list = function (req, res) {
  knex("project")
      .select("projectName", "projectId")
      .where("userId", res.locals.userId)
      .then((projectList) => {
      res.json(projectList);
  });
};

module.exports = allProjectsController;
