// const db = require("../../models");
truncate = require('truncate');
// const Tutorial = db.tutorials;
const DB  = require('../../models/PGC.model')
// const dataDcg = require('../../models/');
const { Sequelize } = require('sequelize');
//const { DB } = require('../Config');
const dataDcg = require('../../models/PGC.model');
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
              OEM_NAME: row[0],
              PRODUCT_GROUP_ID:row[1],
              PRODUCT_GROUP_NAME:row[2], 
              PRODUCT_NAME:row[3],
              PRODUCT_CODE:row[4],
              CREATION_DATE:row[5],
              STATUS_ID: row[6],
              STATUS:row[7],
            };
                
            tutorials.push(tutorial);
          }
        });
      });
     
  }

  if(tutorials && tutorials.length > 0){
    console.log('(tutorial.length: ', tutorials.length);
    await dataDcg.truncate({
      force: true,
    });
    
    for (let _d of tutorials) {
      await dataDcg.create(_d,{
            ignoreDuplicates: true,
        });
      }
    }
  //  return res.status(200).send("Uploaded the file successfully");
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
  const productCode = req.body.productCode;
  console.log("=======", productCode);
  var con = mysql.createConnection({
    host: "127.0.0.1",  
    user: "root",
    password: "Shubham@123",
    database: "sys"
  });
  con.connect(async function (err) {
   
    if (err) throw err;
  // con.query("SET @INPUT  = 12722; SELECT * FROM sys.scheme_dcgs A LEFT JOIN sys.scheme_masters B ON A.dealer_code = B.dealer_group_code LEFT JOIN sys.scheme_pcgs C ON B.product_group_code = C.product_group_id WHERE A.pos_id = @INPUT"
  // , async function (err, resultDcg) {
  //     if (err) throw err;
  //     res.send(resultDcg);
  //   });
  var cond = 'SELECT * from sys.scheme_pcgs where ';
  productCode.forEach((value, index) => {
    cond += 'product_group_id = ' + value;
    if (index < productCode.length-1) {
      cond += ' AND ';
    }
  });
  console.log(cond); 
  con.query(cond
  , async function (err, resultDcg) {
      if (err) throw err;
      res.send(resultDcg);
    });
});

  // schemeMaster.findAll()
    // .then((data) => {
    //   res.send(data);
    // })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving tutorials.",
  //     });
  // });

};
const getById = async (req, res) => {
  // const id = req.params.id;
  const data = await dataDcg.findByPk(req.params.id)
  console.log('req.params.id: ', req.params.id);
  console.log(data);
  res.send(data);



};
const download = (req, res) => {
  Tutorial.findAll().then((objs) => {
    let tutorials = [];

    //   objs.forEach((obj) => {
    //     tutorials.push({
    //       OEM_NAME:obj.OEM_NAME,
    //       POS_ID:obj.POS_ID,
    //       STORE_ID:obj.STORE_ID,
    //     STATUS:obj.STATUS,
    //  DEALER_CODE:obj.DEALER_NAME,
    //     });
    //   });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
      { header: "OEM_NAME", key: "OEM_NAME", width: 25 },
      { header: "PRODUCT_GROUP_ID", key: "PRODUCT_GROUP_ID", width: 5 },
      { header: "PRODUCT_GROUP_NAME", key: "PRODUCT_GROUP_NAME", width: 25 },
      { header: "PRODUCT_NAME", key: "PRODUCT_NAME", width: 25 },
      { header: "PRODUCT_CODE", key: "PRODUCT_CODE", width: 10 },
      { header: "CREATION_DATE", key: "CREATION_DATE", width: 10 },
      { header: "STATUS_ID", key: "STATUS_ID", width: 25 },
      { header: "STATUS", key: "STATUS", width: 25 },


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

};
