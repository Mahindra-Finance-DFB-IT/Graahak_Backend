const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const SmRsmFosData = require("../models/SmRsmFosData");
const _ = require("lodash");


async function ProcessCsv(objCsv){
    await objCsv.model.sync({force: true });
    let tempArr = [];
    fs.createReadStream(path.resolve(__dirname,'../', 'data',objCsv.fileName))
    .pipe(csv.parse({headers:true}))//headers: objCsv.headers,renameHeaders: true
    .on('error', error => console.error(error))
    .on('data', async (row) => {
            for(let _d in row){
                let _data = row[_d].toString().trim();
                _data = (_data=='NULL')?null:_data;
                if(_d == "DOJ" && _data!=null){
                    _data = stringToDate(_data,"dd-mm-yyyy","-")
                }
                row[_d] = _data;
            }
            console.log("ROW ->",row);
            tempArr.push(row);
    })
    .on('end', async (rowCount) =>{
       await objCsv.model.bulkCreate(tempArr,{
       // logging:console.log,
       // individualHooks: true
       });
    });
}

function fileProcess(){
    ProcessCsv({
        fileName:"RSM_SM_FOS_Data.csv",
        //headers:commonHeaders,
        model: SmRsmFosData
    });
};

function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            //console.log(_date);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

fileProcess();