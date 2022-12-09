const express = require('express');
const router = express.Router();
const merchantSchema = require("../validator/Merchant");
const Joi = require("joi");
const { NotFoundError, UnauthorizedError} = require("../core/Error");
const {errorResponse} = require("../core/Response");
const { HTTP_CODES, LOGIN_TYPE, FROM_PAGE } = require('../Config');
const {sendOTP,verifyOTP} = require("../services/Otp");
const { validateMerchant } = require("../services/Merchant");
const { decryptBrowserPassword } = require('../services/Ldap');
const {AxiosError} = require("axios");
const {otpSchema,verifyOtpSchema} = require('../validator/Otp');
const { generateJWT } = require('../core/Jwt');
const logger = require('../core/Logger');
const rateLimiterMiddleware = require('../services/RateLimiter');
const { InsertToken } = require('../services/Token');

router.use(rateLimiterMiddleware);

router.post('/validate', async function(req, res, next) {
    try{
        const transactionID= Date.now();
        const reqData = req.body;
        const validate = merchantSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }
        
        let merchantData =  await validateMerchant(reqData.mobileNumber,reqData.posId,reqData.storeId);
        if(merchantData.status == HTTP_CODES.OK){
           let _merchantData = merchantData.data;
           if(_merchantData.esbResponse.header.isSuccess){
                let otherData = {};
                let headers = {};
                if(reqData.fromPage == FROM_PAGE.HOME){
                    otherData = {
                        "transactionTypeID": "27"
                    };
                    headers = {
                        "channelID": "SEACS",
                        "serviceName": "IVRotp"
                    };
                } 
                let sendOTPData = await sendOTP(reqData.mobileNumber,transactionID,"initial",headers,otherData);
                if(sendOTPData.status == HTTP_CODES.OK){
                    let _sendOTPData = sendOTPData.data;
                    console.log(_sendOTPData);
                    if(_sendOTPData.esbResponse.response.responseCode == "200"){
                        res.json({transactionID,..._sendOTPData.esbResponse.response});
                    }else{
                        logger.error("UNAUTORIZED ERROR "+ _sendOTPData.esbResponse.response.responseDescription);
                        throw new UnauthorizedError("Invalid Merchant credentials");
                    }
                    
                }else{
                    logger.error("UNAUTORIZED ERROR Error in sending OTP");
                    throw new UnauthorizedError("Error in sending OTP");
                }
                
           }else{
            //console.log(_merchantData);
                logger.error("NOTFOUND ERROR "+_merchantData.esbResponse.response.returnText);
                throw new NotFoundError(_merchantData.esbResponse.response.returnText)
           }
        }else{
            throw new AxiosError("Error in validating merchant"); 
        }
        
    }catch(error){
        //console.log(error);
         logger.error("/validate ERROR "+error.message);
         errorResponse(error,res);
    }
});


router.post("/resendOTP",async function(req,res,next){
    try{
        const reqData = req.body;
        const validate = otpSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }

        let otherData = {};
        let headers = {};
        if(reqData.fromPage == FROM_PAGE.HOME){
            otherData = {
                "transactionTypeID": "27"
            };
            headers = {
                "channelID": "SEACS",
                "serviceName": "IVRotp"
            };
        } 
        
        let sendOTPData = await sendOTP(reqData.mobileNumber, reqData.transactionID,"resend",headers,otherData);
        if(reqData?.rsmMobileNumber && reqData?.rsmMobileNumber !=''){
            sendOTP(reqData?.rsmMobileNumber,reqData.transactionID,"resend").then((success)=>{
                logger.info(" RSM OTP SMS IS SENT");
            },(errr)=>{
                loggger.error(" SOMETHING WRONG WHILE SENDING RSM OTP :"+ errr.message);
            });
        }
        if(sendOTPData.status == HTTP_CODES.OK){
            let _sendOTPData = sendOTPData.data;
            if(_sendOTPData.esbResponse.response.responseCode == "200"){
                res.json({transactionID:reqData.transactionID,..._sendOTPData.esbResponse.response});
            }else{
                logger.error("NETWORK ERROR "+_sendOTPData.esbResponse.response.responseDescription);
                throw new AxiosError("Invalid Merchant credentials");
            }
        }else{
            throw new AxiosError("Error in sending OTP");
        }
    }catch(error){
        //console.log(error);
        logger.error("/resendOTP ERROR "+error.message);
        errorResponse(error,res);
    }
})  


router.post("/verifyOTP",async function(req,res,next){
    try{
        const reqData = req.body;
        
        let decryptOtp = await decryptBrowserPassword(reqData.otp);
        reqData.otp = decryptOtp;

        const validate = verifyOtpSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }
        let otherData = {};
        if(reqData.fromPage == FROM_PAGE.HOME){
            otherData = {
                "TransactionTypeId": "27",
                "channelName": "SEACS"
            };
        } 
        
        let verifyOTPData = await verifyOTP(reqData.mobileNumber, reqData.transactionID,reqData.otp,otherData);
        if(verifyOTPData.status == HTTP_CODES.OK){
            let _verifyOTPData = verifyOTPData.data;
            //console.log(_verifyOTPData);
            if(_verifyOTPData.responseCode == "00"){
                reqData.loginType = LOGIN_TYPE.SALESEXECUTIVE.toString();
                let token = await generateJWT(reqData);
                console.log(reqData);
                if(reqData?.fromPage == "LoginPage"){
                    await InsertToken(reqData.mobileNumber, token);
                }
                res.json({
                    token,
                    ..._verifyOTPData
                });
            }else{
                logger.error("UNAUTHORIZED ERROR "+_verifyOTPData.responseDescription);
                throw new UnauthorizedError(_verifyOTPData.responseDescription);
            }
        }else{
            throw new AxiosError("Error in verifying OTP");
        }
    }catch(error){
        logger.error("/verifyOTP ERROR "+error.message);
         errorResponse(error,res);
    }
})  
module.exports = router;
