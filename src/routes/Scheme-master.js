const express = require("express");
const excelController = require("../controllers/tutorials/excel.controller master");
const upload = require("../middlewares/upload");
const schemeMaster = require('../models/master.model');
const router = express.Router();
const bodyParser = require("body-parser")

    router.post("/uploadms", upload.single("file"), excelController.upload);
    router.get("/scheme-master", excelController.getTutorials);
   
  router.get("/scheme-master/:id", excelController.  getById);
  // router.get("/scheme-master/:SCHEME_ID", excelController.  getFById);
  router.get("/download", excelController.download);


  module.exports = router;
