const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const AllNAbndCases = require("../models/AllNAbndCases");
const _ = require("lodash");
const { array } = require('joi');


async function ProcessCsv(objCsv){
    await objCsv.model.sync({force: true });
    let tempArr = [];
    fs.createReadStream(path.resolve(__dirname,'../', 'data',objCsv.fileName))
    .pipe(csv.parse({headers: objCsv.headers,renameHeaders: true})) //headers:true}))
    .on('error', error => console.error(error))
    .on('data', async (row) => {
            for(let _d in row){
                let _data = row[_d].toString().trim().replace(/[^\x00-\x7F]/g, "");;
                _data = (_data=='NULL')?null:_data;//"loan_date","last_mandate_upload_date","maturity_date"
                if(["first_emi_date","last_emi_date"].includes(_d) && _data!=null){
                    _data = stringToDate(_data,"dd-mm-yyyy","-")
                }
                if(_d=="cif"){
                    _data = parseInt(_data);
                    row[_d] = _data;
                }else{
                    row[_d] = _data;
                }

            }
        
            if(row['cif']!='' && row['cif'] !='NULL'){
                console.log("ROW ->",row);
                tempArr.push(row);
                await objCsv.model.create(row);
            }
    })
    .on('end', async (rowCount) =>{
      // await objCsv.model.bulkCreate(tempArr,{
      //  logging:console.log,
       // individualHooks: true
     //  });
    });
}

function fileProcess(){
    ProcessCsv({
        //fileName:"Initial_Mandate_Cases.csv",
        fileName: "All_&_ABND_Cases1.csv",
        headers: [
            "Custshrtname",
            "CustomerNumber",
            "AlternateNumber",
            "Finamount",
            "Deductfeedisb",
            "Downpayment",
            "DisbursementAmt",
            "Limitsanctioned",
            "Utilisedlimit",
            "LoanNumber",
            "DisbursementDt",
            "DealerName",
            "Fincategory",
            "Fintype",
            "FosName",
            "FosNumber",
            "SapCodeSm",
            "SmName",
            "SmNumber",
            "SapCodeRsm",
            "RsmName",
            "RsmNumber",
            "State",
            "City",
            "Closingstatus",
            "Finisactive",
            "EmiAmount",
            "CcLeadId",
            "CcCrmStatusName",
            "Createdon",
            "CustId",
            "Custcif"

        ],
        model: AllNAbndCases
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