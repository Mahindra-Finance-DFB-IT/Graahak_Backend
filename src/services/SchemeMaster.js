truncate = require('truncate');
const schemeMaster = require('../models/master.model');
const readXlsxFile = require("read-excel-file/node");
const { InsertLogs } = require('./UserLogs');

const xlsx = require('xlsx')
const upload = async (req, res) => {
  var totalCount = 0, validRows = 0, invalidRows = 0, columnLength = 0;
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
        // console.log('Row length ' + rows[0].length);
        columnLength = rows[0].length;
        rows.shift();
        totalCount = rows.length;
        if (columnLength == 29) {
          rows.map(async (row, index) => {
            if (index >= 0) {
              var rowStatus = await validateData(row);
              console.log('rowStatus ' + rowStatus);
              if (rowStatus) {
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
                validRows++;
                tutorials.push(tutorial);
              } else {
                invalidRows++;
              }
            }
          });
        }
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
    await InsertLogs(req, 'uploadMaster', 1, '');
    if (validRows > 0) {
      return res.status(200).send({
        res: "success",
        totalCount: totalCount,
        validRows: validRows,
        invalidRows: invalidRows
      });
    } else {
      var errMsg = "Could not upload the files: " + req.file.originalname;
      if (columnLength != 29) {
        errMsg = "Invalid file uploaded. Please upload valid Scheme Master File."
      }
      res.status(columnLength != 29 ? 501 : 500).send({
        message: errMsg,
        totalCount: totalCount,
        validRows: validRows,
        invalidRows: invalidRows
      });
    }
  } catch (error) {
    await InsertLogs(req, 'uploadMaster', 1, '');
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
      totalCount: totalCount,
      validRows: validRows,
      invalidRows: invalidRows
    });
  }
};

async function validateData(row) {
  if (!row[0] || !row[1] || !row[2]) {
    return false;
  }
  // tenure
  var tenure = Number(row[3]);
  if (isNaN(tenure) || tenure == 0) {
    return false;
  }
  if (!row[4] || !row[5] || !row[7] || !row[12] || !row[13] || !row[14] || !row[18] || !row[19] 
    || !row[20] || !row[21] || !row[22]) {
    return false;
  }
  if (isNaN(Number(row[6]))) {
    return false;
  }
  // start & end date

  // max amount
  var max_amount = Number(row[10]);
  if (isNaN(max_amount) || max_amount == 0) {
    return false;
  }
  // min amount
  var min_amount = Number(row[11]);
  if (isNaN(min_amount) || min_amount == 0) {
    return false;
  }
  if (isNaN(Number(row[15])) || isNaN(Number(row[16])) || isNaN(Number(row[17])) || 
  isNaN(Number(row[23])) || isNaN(Number(row[24])) || isNaN(Number(row[25])) || 
  isNaN(Number(row[26])) || isNaN(Number(row[27])) || isNaN(Number(row[28]))) {
    return false;
  }
  return true;
}

module.exports = {
  upload
};
