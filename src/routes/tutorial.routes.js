const express = require ("express");
const excelController = require("../controllers/tutorials/excel.controller");
const upload = require("../middlewares/upload");

const router = express.Router();

  router.post("/uploaddcg", upload.single("file"), excelController.upload);
  router.post("/query", excelController.getTutorials);
//  router.get("/:id", excelController.  getById);
  router.get("/download", excelController.download);
  router.post('/:id',excelController.getById) 





module.exports = router;
