const axios = require("axios");
const { 
    MERCHANT_API 
}   = require("../Config");
const uuid = require('uuid');

const HEADERS = {
    "x-ibm-client-id":"afaef778-43ce-4dc4-9a3c-d6d9242b2200"
};
                            
async function validateMerchant( mobileNumber,posId,storeId){
    try{
        return await axios({
                   url: MERCHANT_API,
                   method: 'POST',
                   headers: HEADERS,
                   data : {
                    "esbRequest": {
                        "header": {
                            "channelID": "ESB",
                            "serviceName": "MERCHANTAUTH",
                            "uniqueReqNo": Date.now(),
                            "timestamp": Date.now()
                        },
                        "request": {
                            mobileNumber,
                            posId,
                            storeId
                        }
                    }
                }
               });
           }catch(error){
               console.log(error);
               throw error;
           }
}

module.exports = {
    validateMerchant
}