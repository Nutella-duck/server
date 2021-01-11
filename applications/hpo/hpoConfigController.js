const knex = require("../../db/knex");

let hpoConfigController = {};

const gethpoProjcet = async (projectName) => {
  return knex
    .select("hpoProjectId")
    .from("hpoproject")
    .where({ hpoName: projectName })
    .then((result) => {
      return result[0].hpoProjectId;
    });
};

hpoConfigController.bestResult = async (req, res) => {
  const projectId = req.params.id;
  knex
    .select("bestParameter", "bestResult")
    .from("hpoConfig")
    .where({ hpoProjectId: projectId })
    .then((result) => {
      res.json(result[0]);
    });
};

hpoConfigController.read = async (req, res) => {
  const projectId = req.params.id;
  knex
    .select("method", "config")
    .from("hpoConfig")
    .where({ hpoProjectId: projectId })
    .then((result) => {
      res.json(result[0]);
    });
};

hpoConfigController.create = async (req, res) => {
  const { projectName, method, config } = req.body;
  const projectId = await gethpoProjcet(projectName);
  const configToString = JSON.stringify(config);
  knex
    .insert({ method: method, config: configToString, hpoProjectId: projectId })
    .into("hpoconfig")
    .then((result) => {
      res.end("hpoconfig Created");
    });
};

module.exports = hpoConfigController;
