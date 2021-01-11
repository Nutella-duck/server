const knex = require("../../../db/knex");
var generateSafeId = require("generate-safe-id");
const { select } = require("../../../db/knex");

let projectController = {};

projectController.create = function (req, res) {
  knex("project")
    .insert({
      projectName: req.body.params.projectName,
      description: req.body.params.description,
      privacy: req.body.params.privacy || 1,
      apiKey: req.body.params.apiKey,
    })
    .then(() => {
      res.send("A project is created");
    });
};

projectController.getkey = function (req, res) {
  res.send(generateSafeId());
};

projectController.read = function (req, res) {
  knex("project")
      .where("project.projectId", req.params.id)
      .select("project.projectId", "project.projectName", function() {
        this.count("run.projectId").as("totalRun")
      })
      .leftJoin("run", "project.projectId", "run.projectId").as("results")
      .groupBy("project.projectId")
      .then((projectList) => {
      res.json(projectList);
  });
};

projectController.delete = function (req, res) {
  knex("project")
    .where("projectId", req.params.id)
    .del()
    .then(() => {
      res.end("A Project is deleted");
    });
};

projectController.update = function (req, res) {
  knex("project")
    .where("projectId", req.params.id)
    .update({
      description: req.body.params.description,
      projectName: req.body.params.projectName,
      privacy: req.body.params.privacy
     })
    .then(() => {
      res.end("A project is updated");
    });
};

module.exports = projectController;