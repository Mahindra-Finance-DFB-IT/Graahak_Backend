truncate = require('truncate');
const schemeMaster = require('../models/master.model');
const readXlsxFile = require("read-excel-file/node");
const { InsertLogs } = require('./UserLogs');

const xlsx = require('xlsx')
const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    // console.log(req.file);
    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    let file =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    const workbook = xlsx.readFile(file);
    const sheetList = workbook.SheetNames;
    var tutorials = [];

    for (const sheetName of sheetList) {
      await readXlsxFile(path, { sheet: sheetName }).then((rows) => {
        rows.shift();
        rows.map(async (row, index) => {
          if (index >= 0) {
            let tutorial = {
              OEM: row[0],
              SCHEME_ID: row[1],
              SCHEME_DESCRIPTION: row[2],
              TENURE: row[3],
              Scheme_IRR: row[4],
              ROI: row[5],
              ADVANCE_EMI: row[6],
              DBD: row[7],
              SCHEME_START_DATE: row[8],
              SCHEME_END_DATE: row[9],
              MAX_AMOUNT: row[10],
              MIN_AMOUNT: row[11],
              PROCESSING_FEE: row[12],
              PORTAL_DESCRIPTION: row[13],
              Action: row[14],
              STATUS: row[15],
              SPECIAL_SCHEME_FLAG: row[16],
              IS_PF_SCHEME: row[17],
              PROCESSING_FEE_PERCENTAGE: row[18],
              MDR_PERCENTAGE: row[19],
              MDR_AMOUNT: row[20],
              MBD_PERCENTAGE: row[21],
              MBD_AMOUNT: row[22],
              PRODUCT_GROUP_CODE: row[23],
              ACTION_SPM_FILE: row[24],
              STATUS_SPM_FILE: row[25],
              DEALER_GROUP_CODE: row[26],
              ACTION_SDM_FILE: row[27],
              STATUS_SDM_FILE: row[28],
            };
            tutorials.push(tutorial);
          }
        });
      });

      if (tutorials && tutorials.length > 0) {
        await schemeMaster.truncate({
          force: true,
        });

        for (let _d of tutorials) {
          await schemeMaster.create(_d, {
            ignoreDuplicates: true,
          });
        }
      }
    }
    await InsertLogs(req, 'uploadms', 1, '');
    return res.status(200).send('{"res":"success"}');
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

module.exports = {
  upload
};
