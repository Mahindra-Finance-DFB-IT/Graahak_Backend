const express = require("express");
const excelController = require("../services/SchemeMaster");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/uploadms", upload.single("file"), excelController.upload);

module.exports = router;
