const express = require("express");
const router = express.Router();

const hpoProjectController = require("../applications/hpo/hpoProjectController");
const hpoRunController = require("../applications/hpo/hpoRunController");
const importanceController = require("../applications/hpo/ImportanceController");
const hpoConfigController = require("../applications/hpo/hpoConfigController");

router.get("/hpo/hpoProject", hpoProjectController.read);
router.get("/hpo/bestResult/:id", hpoConfigController.bestResult);
router.get("/hpo/importances/:id", importanceController.read);
router.get("/hpo/Key", hpoProjectController.getKey);
router.get("/hpo/result/:id", hpoRunController.read);

router.post("/hpo/hpoProject", hpoProjectController.create);

router.get("/hpo/config/:id", hpoConfigController.read);
router.post("/hpo/config", hpoConfigController.create);

module.exports = router;
