truncate = require('truncate');
const dataDcg = require('../models/tutorial.model');
const readXlsxFile = require("read-excel-file/node");
const xlsx = require('xlsx')
const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    let file = __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    const workbook = xlsx.readFile(file);
    const sheetList = workbook.SheetNames;
    var tutorials = [];
    for (const sheetName of sheetList) {  
      await readXlsxFile(path, { sheet: sheetName }).then(async (rows) => {
        await dataDcg.destroy({
         where:{
          'oem_name':sheetName
         }
        });
        var dealer_g_code=rows[1][0];
        var repl = dealer_g_code.replace("Dealer Group ID: ", "");

        rows.shift();
        rows.map(async (row, index) => {
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
  if(tutorials && tutorials.length > 0){
    // await dataDcg.truncate({
    //   force: true,
    // });
    
    for (let _d of tutorials) {
      await dataDcg.create(_d,{
          ignoreDuplicates: true,
        });
      }
    }
    return res.status(200).send('{"res":"success"}');
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

module.exports = {
  upload,
};
