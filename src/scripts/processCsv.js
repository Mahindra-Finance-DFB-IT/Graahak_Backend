const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const CustomerDetails = require("../models/CustomerDetails");
const _ = require("lodash");

const commonHeaders = ["customerName",
"source_flag",
"customer_id",
"mobile_number",
"loan_limit",
"rejection_type",
"rejection_reason",
"bank",
"ifsc",
"account_number",
"last_mandate_upload_date",
"fintype",
"vas_fos",
"vas_fos_number",
"vas_sm",
"vas_rsm",
"vas_dealer",
"tid",
"vas_tid",
"finreference"];

const dataProcess= [{
    fileName:"Mandate_Cases.csv",
    headers:commonHeaders,
    model: CustomerDetails
},{
    fileName:"Rejected_Cases.csv",
    headers:commonHeaders,
    model: CustomerDetails
}]

function ProcessData(){
    dataProcess.forEach(async (objCsv)=>{
        await objCsv.model.sync();
        ProcessCsv(objCsv);
    })

}

function ProcessCsv(objCsv){
    let tempArr = [];
    fs.createReadStream(path.resolve(__dirname,'../', 'data',objCsv.fileName))
    .pipe(csv.parse({ headers: objCsv.headers,renameHeaders: true }))
    .on('error', error => console.error(error))
    .on('data', async (row) => {
            console.log(_.transform(row,(val)=> (val=='NULL')?null:val));
            console.log(row);
            tempArr.push(row);
    })
    .on('end', async (rowCount) =>{
        await objCsv.model.bulkCreate(tempArr);
    });
}

ProcessData();