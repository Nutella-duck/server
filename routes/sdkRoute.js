const express = require("express");
const router = express.Router();

const sdkController = require("../applications/hpo/hpoSdkController.js");

router.post("/sdk", sdkController.log);
router.get("/sdk", sdkController.init);
router.post("/sdk/hpo", sdkController.hpo);
router.get("/sdk/hpo", sdkController.getHpo);

module.exports = router;
