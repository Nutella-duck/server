const { KnexTimeoutError } = require("knex");
const knex = require("../../../db/knex");

let runController = {};

runController.create = function (req, res) {
  console.log(req.body);
  const { runName, projectKey } = req.body;
  console.log(runName + " " + projectKey);
  knex
    .insert({
      runName: runName,
      state: "CREATED", // 미정
      reinit: false, // 미정
      runTime: 0, // 미정
      createdBy: "project", // 미정
      projectId: 1,
    })
    .into("run")
    .then((result) => {
      res.end("success");
    });
};
runController.read = function (req, res) {
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

runController.delete = function (req, res) {
  knex("run")
    .where("runId", req.params.id)
    .del()
    .then(() => {
      res.end("A run is deleted");
    });
};

runController.update = function (req, res) {
  knex("run")
    .where("runId", req.params.id)
    .update({
      runName: req.body.params.runName,
    })
    .then(() => {
      res.end("A run is updated");
    });
};

module.exports = runController;
