const express = require("express");
const excelController = require("../controllers/tutorials/excel.controller PGC");
const upload = require("../middlewares/upload");
const router = express.Router();

  router.post("/uploadpcg", upload.single("file"), excelController.upload);
  router.post("/query", excelController.getTutorials);
  router.get("/:id", excelController.  getById);
  router.get("/pgc/:id", excelController.getById);
  router.get("/download", excelController.download);


module.exports = router;
