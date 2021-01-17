const knex = require("../../../db/knex");
const { select } = require("../../../db/knex");

let projectListController = {};

projectListController.read = function (req, res) {
    knex("project")
        .select("projectName", "projectId")
        .where("userId", res.locals.userId)
        .then((projectList) => {
        res.json(projectList);
    });
};

module.exports = projectListController;