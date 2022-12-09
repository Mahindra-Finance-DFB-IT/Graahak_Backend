truncate = require('truncate');
const dataPcg = require('../models/PGC.model');
const readXlsxFile = require("read-excel-file/node");
const  sequelize  = require("../core/Db");
const { InsertLogs } = require('./UserLogs');
const xlsx = require('xlsx')
const upload = async (req, res) => {
  var totalCount = 0, activeCount = 0, inActiveCount = 0;
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
       var sheetNames = sheetName.toLowerCase().trim().replace(' ','_');
        // console.log('sheetName:============== ', sheetNames);
        await dataPcg.destroy({
         where:{
          'oem_name': sheetNames
         }
        });
        rows.shift();
        totalCount += rows.length;
        rows.map(async (row, index) => {
          var status = row[7].toLowerCase();
          var productName = row[3].trim().replace(/"/g, '');
          productName = productName.trim().replace(/'/g, '');
          if (index >= 0 && status=='active') {
            let tutorial = {
              OEM_NAME: sheetNames,
              PRODUCT_GROUP_ID: row[1],
              PRODUCT_GROUP_NAME: row[2], 
              PRODUCT_NAME: productName,
              PRODUCT_CODE: row[4],
              CREATION_DATE: '',
              STATUS_ID: row[6],
              STATUS: row[7],
            };
            tutorials.push(tutorial);
          } else {
            inActiveCount++;
          }
        });
      });
    }
    if (tutorials && tutorials.length > 0 ) {
      for (let row of tutorials) {
        var apiResult;
        var insertPcg = 'INSERT into scheme_pcgs (oem_name, product_group_id, product_name, product_code, creation_date, status_id, status) VALUES ("' + row.OEM_NAME + '", "' + row.PRODUCT_GROUP_ID + '","' + row.PRODUCT_NAME + '", "' + row.PRODUCT_CODE + '", "", "' +  row.STATUS_ID + '", "' +  row.STATUS + '")';
        apiResult = await sequelize.query(insertPcg,{
          raw: true,
          type: 'INSERT'
        });
        if (apiResult[0] > 0) {
          activeCount++;
        }
        // await dataPcg.create(_d,{
        //   ignoreDuplicates: true,
        // });
      }
    }
    await InsertLogs(req, 'uploadPcg', 1, '');
    return res.status(200).send('{"res":"success", "totalCount": '+ totalCount +', "activeCount": '+ activeCount +', "inActiveCount": '+ inActiveCount +', "errorRecords": 0}');
  } catch (error) {
    await InsertLogs(req, 'uploadPcg', 1, '');
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
      totalCount: totalCount,
      activeCount: activeCount,
      inActiveCount: inActiveCount,
      errorRecords: totalCount - activeCount
    });
  }
};
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
module.exports = {
  upload,
  download
};
