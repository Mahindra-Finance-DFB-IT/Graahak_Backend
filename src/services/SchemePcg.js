truncate = require('truncate');
const dataPcg = require('../models/PGC.model');
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
        await dataPcg.destroy({
         where:{
          'oem_name':sheetName
         }
        });
        rows.shift();
        rows.map(async (row, index) => {
          var status = row[7].toLowerCase();
          console.log('status: ', status);
          if (index >= 0 && status=='active') {
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

    if (tutorials && tutorials.length > 0 ) {
      // console.log('(tutorial.length: ', tutorials.length);
        // await dataPcg.truncate({
        //   force: true,
        // });
      
      for (let _d of tutorials) {
        await dataPcg.create(_d,{
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
  upload
};
