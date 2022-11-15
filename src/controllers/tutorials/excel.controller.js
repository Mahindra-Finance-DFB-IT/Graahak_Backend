// const db = require("../../modelss");
truncate = require('truncate');
// const Tutorial = db.tutorials;
const DB  = require('../../models/tutorial.model')
const { Sequelize } = require('sequelize');
//const { DB } = require('../Config');
const dataDcg = require('../../models/tutorial.model');
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
        console.log('sheetName: ', sheetName);
        var dealer_g_code=rows[1][0];
      //  let result = dealer_g_code.indexOf("");
        //let resultLen = dealer_g_code.length;
        var repl=dealer_g_code.replace("Dealer Group ID: ", "");

        // var dealer_subs=dealer_g_code.substring(result,resultLen-result);
       console.log('rows: ', repl);
        rows.shift();
        rows.map(async (row, index) => {
          // if(index==1)
          // {
          //   console.log("Row 1: ",rows[1]);
          // }
          if (index >= 2) {
           
            let tutorial = {
              OEM_NAME: sheetName,
              POS_ID: row[0],
              STORE_ID: row[1],
              MERCHANT_NAME:row[3],
              STATUS: row[4],
              DEALER_CODE: row[5],
               DEALER_CODE_ID: repl,

            };           
           tutorials.push(tutorial);       
            
          }
        });
      });
     
  }
  for (const sheetName of sheetList) {
    console.log('sheetName: ', sheetName);
    "DELETE FROM sys.scheme_pcgs WHERE sheetName"
    
   
}
  if(tutorials && tutorials.length > 0){
    // console.log('(tutorial.length: ', tutorials.length);
    await dataDcg.truncate({
      force: true,
    });
    
    for (let _d of tutorials) {
      await dataDcg.create(_d,{
            ignoreDuplicates: true,
        });
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
  const pos_id = req.body.posid;
  console.log("=======", pos_id);
  var con = mysql.createConnection({
    host: "127.0.0.1",  
    user: "root",
    password: "Shubham@123",
    database: "sys"
  });
  con.connect(async function (err) {
   
    if (err) throw err;
  
    //var cond='SELECT * FROM sys.scheme_dcgs A inner JOIN sys.scheme_masters B ON A.dealer_code_id = B.dealer_group_code  WHERE A.pos_id ='+pos_id;
    var cond="SELECT *,GROUP_CONCAT(product_name SEPARATOR '|')  as pname FROM sys.scheme_dcgs A   inner JOIN sys.scheme_masters B ON A.dealer_code_id = B.dealer_group_code  inner JOIN sys.scheme_pcgs C ON B.product_group_code = C.product_group_id  WHERE A.pos_id ="+pos_id+ " group by product_group_id;";
   con.query( cond
  , async function (err, resultDcg) {
      if (err) throw err;
      res.send(resultDcg);
    });
});
   

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
  let pos_id = req.body.posid;
  let id = req.params.id;
  console.log("=======>", pos_id);
  var con = mysql.createConnection({
    host: "127.0.0.1",  
    user: "root",
    password: "Shubham@123",
    database: "sys"
  });
  con.connect(async function (err) {
   
    if (err) throw err;
  
    //var cond='SELECT * FROM sys.scheme_dcgs A inner JOIN sys.scheme_masters B ON A.dealer_code_id = B.dealer_group_code  WHERE A.pos_id ='+pos_id;
    var cond2="SELECT * FROM sys.scheme_dcgs A  inner JOIN sys.scheme_masters B ON A.dealer_code_id = B.dealer_group_code inner JOIN sys.scheme_pcgs C  ON B.product_group_code = C.product_group_id WHERE A.pos_id ="+pos_id+ " AND C.id = "+id;
   con.query( cond2
    , async function (err, resultDcg) {
      console.log('cond2: ', cond2);
      if (err) throw err;
      res.send(resultDcg);
    });
});
   
  // const data = await dataDcg.findByPk(req.params.id)
  // console.log('req.params.id: ', req.params.id);
  // console.log(data);
  // res.send(data);
  


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
      { header: "OEM_NAME", key: "OEM_NAME", width: 5 },
      { header: "POS_ID", key: "POS_ID", width: 5 },
      { header: "STORE_ID", key: "STORE_ID", width: 25 },
      { header: "MERCHANT_NAME", key: "merchant_name", width: 25 },
      { header: "STATUS", key: "STATUS", width: 25 },
      { header: "DEALER_CODE", key: "DEALER_CODE", width: 10 },
      { header: "DEALER_CODE_ID", key: "DEALER_CODE_ID", width: 10 },


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
