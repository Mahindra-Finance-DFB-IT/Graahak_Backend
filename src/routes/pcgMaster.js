const express = require("express");
const excelController = require("../services/SchemePcg");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/uploadpcg", upload.single("file"), excelController.upload);

module.exports = router;
