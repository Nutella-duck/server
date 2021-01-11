const knex = require("../../db/knex");

let hpoRunController = {};

hpoRunController.read = async (req, res) => {
  const id = req.params.id;

  knex
    .select("target", "config", "runName")
    .from("hpoRun")
    .where({ hpoProjectId: id })
    .then((result) => {
      res.json(result);
    });
};

module.exports = hpoRunController;
