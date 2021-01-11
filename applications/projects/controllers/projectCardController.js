const knex = require("../../../db/knex");
const { subscribe } = require("../../../routes/runRoute");

let projectCardController = {};

projectCardController.read = function (req, res) {
  let pageNum = req.query.page;
  let offset = pageNum > 1 ? 6 * (pageNum - 1) : 0;

  knex("project")
    .select(
      "project.projectId",
      "project.projectName",
      "project.description",
      "project.privacy",
      "project.created_at",
      function () {
        this.count("run.projectId").as("totalRun");
      }
    )
    .leftJoin("run", "project.projectId", "run.projectId")
    .as("results")
    .groupBy("project.projectId")
    .limit(6)
    .offset(offset)
    .then((projectCardList) => {
      res.json(projectCardList);
    });
};

module.exports = projectCardController;
