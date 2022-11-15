// const db = require("../../models");
truncate = require('truncate');
// const Tutorial = db.tutorials;
const DB = require('../../models/tutorial.model')
const { Sequelize } = require('sequelize');
//const { DB } = require('../Config');
const schemeMaster = require('../../models/master.model');
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const readSheetNames = require("read-excel-file/node");
const xlsx = require('xlsx')
var mysql = require('mysql2');
const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

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

            // tutorials.push(tutorial);
          }
        });
      });

      if (tutorials && tutorials.length > 0) {
        // console.log('(tutorial.length: ', tutorials.length);
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

    return res.status(200).send('{"res":"sucess"}');
    // DB.bulkCreate(tutorials)
    //   .then(() => {
    //     res.status(200).send({
    //       message: "Uploaded the file successfully: " + req.file.originalname,
    //     });
    //   })
    //   .catch((error) => {
    //     res.status(500).send({
    //       message: "Fail to import data into database!",
    //       error: error.message,
    //     });
    //   });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};
function uploaddata(req, res) {
  return new Promise()
}

const getTutorials = async (req, res) => {
//   const dealerCode = req.body.dealerCode;
//   console.log("=======", dealerCode);
//   var con = mysql.createConnection({
//     host: "127.0.0.1",  
//     user: "root",
//     password: "Shubham@123",
//     database: "sys"
//   });
//   con.connect(async function (err) {
   
//     if (err) throw err;
//   // con.query("SET @INPUT  = 12722; SELECT * FROM sys.scheme_dcgs A LEFT JOIN sys.scheme_masters B ON A.dealer_code = B.dealer_group_code LEFT JOIN sys.scheme_pcgs C ON B.product_group_code = C.product_group_id WHERE A.pos_id = @INPUT"
//   // , async function (err, resultDcg) {
//   //     if (err) throw err;
//   //     res.send(resultDcg);
//   //   });
//  // var cond = 'SELECT * from sys.scheme_masters where ';

// //  var cond='SELECT * FROM sys.scheme_dcgs A  LEFT JOIN sys.scheme_masters B ON A.dealer_code = B.dealer_group_code LEFT JOIN sys.scheme_pcgs C ON B.product_group_code = C.product_group_id';
 
//  dealerCode.forEach((value, index) => {
//    // cond += 'dealer_group_code = ' + value;
//   //  cond += 'WHERE A.pos_id = ' + "468737";
//     if (index < dealerCode.length-1) {
//       // cond += ' AND ';
//     }
//   });
//   console.log(cond); 
//   con.query(cond
//   , async function (err, resultDcg) {
//       if (err) throw err;
//       res.send(resultDcg);
//     });
// });
   
  schemeMaster.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
  });

};

const getUniqueId = async (req, res) => {
  // console.log('uniqueProductCode: ',this. uniqueProductCode);
}
const getById = async (req, res) => {
  // const id = req.params.id;
  const data = await schemeMaster.findByPk(req.params.id)
  console.log('req.params.id: ', req.params.id);
  console.log(data);
  res.send(data);



};
const getFById = async (req, res) => {
  // const id = req.params.id;
  const data = await schemeMaster.findAll(SCHEME_ID = req.params.SCHEME_ID)
  console.log('freq.params.id: ', req.params.SCHEME_ID);
  console.log(data);
  res.send(data);



};
const download = (req, res) => {
  Tutorial.findAll().then((objs) => {
    let tutorials = [];

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
      { header: "OEM", key: "OEM", width: 25 },
      { header: "SCHEME_ID", key: "SCHEME_ID", width: 5 },
      { header: "SCHEME_DESCRIPTION", key: "SCHEME_DESCRIPTION", width: 25 },
      { header: "TENURE", key: "TENURE", width: 25 },
      { header: "Scheme_IRR", key: "Scheme_IRR", width: 25 },
      { header: "ROI", key: "ROI", width: 25 },
      { header: "ADVANCE_EMI", key: "ADVANCE_EMI", width: 10 },
      { header: "DBD", key: "DBD", width: 10 },
      { header: "SCHEME_START_DATE", key: "SCHEME_START_DATE", width: 25 },
      { header: "SCHEME_END_DATE", key: "SCHEME_END_DATE", width: 25 },
      { header: "MAX_AMOUNT", key: "MAX_AMOUNT", width: 25 },
      { header: "MIN_AMOUNT", key: "MIN_AMOUNT", width: 5 },
      { header: "PROCESSING_FEE", key: "SCHEME_DESCRIPTION", width: 25 },
      { header: "PORTAL_DESCRIPTION", key: "PORTAL_DESCRIPTION", width: 25 },
      { header: "Action", key: "Action", width: 10 },
      { header: "STATUS", key: "STATUS", width: 10 },
      { header: "SPECIAL_SCHEME_FLAG", key: "SPECIAL_SCHEME_FLAG", width: 25 },
      { header: "IS_PF_SCHEME", key: "IS_PF_SCHEME", width: 25 },
      { header: "PROCESSING_FEE_PERCENTAGE", key: "PROCESSING_FEE_PERCENTAGE", width: 25 },
      { header: "MDR_PERCENTAGE", key: "MDR_PERCENTAGE", width: 5 },
      { header: "MDR_AMOUNT", key: "MDR_AMOUNT", width: 25 },
      { header: "MBD_PERCENTAGE", key: "MBD_PERCENTAGE", width: 25 },
      { header: "MBD_AMOUNT", key: "MBD_AMOUNT", width: 10 },
      { header: "PRODUCT_GROUP_CODE", key: "PRODUCT_GROUP_CODE", width: 10 },
      { header: "ACTION_SPM_FILE", key: "ACTION_SPM_FILE", width: 25 },
      { header: "STATUS_SPM_FILE", key: "STATUS_SPM_FILE", width: 25 },
      { header: "DEALER_GROUP_CODE", key: "DEALER_GROUP_CODE", width: 25 },
      { header: "ACTION_SDM_FILE", key: "ACTION_SDM_FILE", width: 5 },
      { header: "STATUS_SDM_FILE", key: "STATUS_SDM_FILE", width: 25 },


    ];

    // Add Array Rows
    worksheet.addRows(tutorials);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsb"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};
function getSheets(path) {
  var reader;
  reader = new FileReader();
  reader.onload = function (e) {
    var data;
    var workbook;
    var sheets;
    data = e.target.result();
    workbook = XLSX.read(data, { type: 'binary' });
    sheet = workbook.SheetNames;
    for (var i in sheets.items) {
      // console.log(sheets.items[i].name);
    }
  }
  reader.onerror = function (ex) {
    // console.log(ex);
  }
  reader.readAsBinaryString(path);
}
module.exports = {

  upload,
  uploaddata,
  getTutorials,
  download,
  getSheets,
  getById,
  getFById,
  getUniqueId,
};
