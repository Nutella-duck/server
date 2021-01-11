const knex = require("../../db/knex");
var generateSafeId = require("generate-safe-id");
let hpoProjectController = {};

hpoProjectController.read = async (req, res) => {
  knex
    .select("hpoName", "description", "createBy", "hpoProjectId")
    .from("hpoProject")
    .then((result) => {
      res.json(result);
    });
};

hpoProjectController.getKey = async (req, res) => {
  res.end(generateSafeId());
};

hpoProjectController.create = async (req, res) => {
  const { hpoName, description, apiKey, createBy } = req.body;
  knex
    .insert({
      hpoName: hpoName,
      description: description,
      apiKey: apiKey,
      createBy: createBy,
    })
    .into("hpoProject")
    .then((result) => {
      res.end("hpoProjectCreated");
    });
};

module.exports = hpoProjectController;
