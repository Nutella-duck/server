const express = require("express");
const router = express.Router();

const graph = require("../applications/runs/controllers/graphController.js");
// const system = require("../applications/runs/controllers/systemController.js");

// graph 그리기 위한
router.get("/graph/:id", graph.read);

// router.get("/system/:id", system.read)

module.exports = router;
