const axios = require("axios");
const { 
    SEND_OTP,
    RESEND_OTP,
    VERIFY_OTP 
}   = require("../Config");
const uuid = require('uuid');

// staging
const HEADERS = {
    origin: "cdmobuat.mahindrafs.com",
    "x-ibm-client-id":"5a762374-ccdf-440a-9560-39fc7163ecbd"
};

// production
// const HEADERS = {	
//     origin: "graahak.mahindrafs.com",	
//     "x-ibm-client-id":"5f4d8dc1a3361381fd0498658f114e32"	
// };

async function sendOTP(mobileNo, transactionID,stage,headers,otherData){
    try{
        // console.log("MOBILE NO: ",mobileNo);
        // console.log("Transaction ID: ",transactionID);
        const oldHeaders = {
            "apiVersion": "",
            "channelID": "Snapmint",
            "deviceID": "",
            "languageId": "",
            "serviceName": "IVRotp",
            "os": "",
            "osVersion": "",
            "uniqueReqNo": uuid.v4(),
            "timestamp": Date.now(),
            "geoLocation": ""
        };

        const newHeaders={...oldHeaders,...headers};
        const axiosRequest = {
            url: SEND_OTP,
            method: 'POST',
            headers: HEADERS,
            data : {
                "esbRequest": {
                    "header":newHeaders ,
                    "request": {
                        stage,
                        mobileNo,
                        transactionID,
                        transactionTypeID: "7",
                        emailId: "",
                        type: "M",
                        ...otherData
                    }
                }
            }
        };
        // console.log(JSON.stringify(axiosRequest));
        return await axios(axiosRequest);
        }catch(error){
            throw error;
        }
}


async function verifyOTP(mobileNo,transactionID,otp,otherData){
//https://esbuat.mmfsl.com/mahindrafinance/uat/api/otp/validate
    try{
        const axiosReq = {
            url: VERIFY_OTP,
            method: 'POST',
            headers: HEADERS,
            data : {
                 "mobile": mobileNo,
                 "TransactionID": transactionID,
                 "TransactionTypeId": "7",
                 "otp": otp,
                 "CardNumber": "",
                 "channelName": "Snapmint",
                 ...otherData
             }
        };
        // console.log(axiosReq);
        return await axios(axiosReq);
       }catch(error){
            console.log(error);
           throw error;
       }
}   


module.exports = {
    sendOTP,
    verifyOTP
}
