const knex = require("../../db/knex");
let importanceController = {};

importanceController.read = async (req, res) => {
  const projectId = req.params.id;

  knex
    .select("parameter", "configParameter", "importance", "correlation")
    .from("parameterImportance")
    .where({ hpoProjectId: projectId })
    .then((result) => {
      res.json(result);
    });
};

module.exports = importanceController;
