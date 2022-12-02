const express = require('express');
const Joi = require('joi');
const { HTTP_CODES } = require('../Config');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../core/Error');
const { generateJWT } = require('../core/Jwt');
const logger = require('../core/Logger');
const { errorResponse } = require('../core/Response');
const { GetCustomerDetails, GetSMRSMMobileNumber, findOneCustomer, GetScheduleData, GetSchemeList, GetSchemeDetail,GetSchemeData } = require('../services/CustomerDetails');
const { sendOTP, verifyOTP } = require('../services/Otp');
const rateLimiterMiddleware = require('../services/RateLimiter');
const { ValidateToken } = require('../services/Token');
const { customerDetailsSchema } = require('../validator/CustomerDetails');
const { verifyOtpSchema, verifySmRSMOtpSchema } = require('../validator/Otp');
const excelController = require("../services/SchemeDcg");
const router = express.Router();

router.use(rateLimiterMiddleware);

router.use(async (req, res, next) => {
    try{
        logger.info('Time: '+ Date.now());
        const isValid = await ValidateToken(req);
        if(isValid){
            next()
        }else{
            throw UnauthorizedError("Invalid Token")
        }
    }catch(err){
        errorResponse(err,res);
    }
});

router.get("/scheduleData",async function(req,res,next){
    try{
        let data = await GetScheduleData();
        return res.json(data);
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }  
});


router.post("/get",async function(req, res, next) {
    try{
        const reqData = req.body;
        const validate = customerDetailsSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }
        const custData  = await findOneCustomer(reqData?.searchData);
        if(custData == null || custData.length == 0){
            throw new NotFoundError("Incorrect Customer Details");
        }
        
        const customerData = await GetCustomerDetails(reqData);
        if(customerData == null || customerData.length == 0){
            throw new NotFoundError("No customer registered with this Mobile/PAN number");
        }
        
        return res.json(customerData);
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }   
});

router.post("/fetchSmRsmMobile",async function (req, res, next){
    try{
        await _sendOtp(req,res,"initial");
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }  
});

router.post("/resendOtpSmRsmMobile",async function (req, res, next){
    try{
        await _sendOtp(req,res,"resend");
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }  
});


router.post("/verifyOtpSmRsmMobile",async function (req, res, next){
    try{
        const reqData = req.body;
        const validate = verifySmRSMOtpSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }
        let verifyOTPData = await verifyOTP(reqData.mobileNumber, reqData.transactionID,reqData.otp,{ 
            "TransactionTypeId":"26",
            "channelName":"SEACS"
        });
        if(verifyOTPData.status == HTTP_CODES.OK){
            let _verifyOTPData = verifyOTPData.data;
            //console.log(_verifyOTPData);
            if(_verifyOTPData.responseCode == "00"){
                let token = await generateJWT(reqData);
                res.json({token,..._verifyOTPData});
            }else{
                console.log(_verifyOTPData);
                logger.error("UNAUTHORIZED ERROR "+_verifyOTPData.responseDescription);
                throw new UnauthorizedError(_verifyOTPData.responseDescription);
            }
        }else{
            throw new AxiosError("Error in verifying OTP");
        }
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }  
});

router.post("/getSchemes", async function(req, res, next) {
    try{
        const posid = req.body.posid;
        console.log(posid);
        const schemeData = await GetSchemeList(posid);
        if (schemeData == null || schemeData.length == 0){
            throw new NotFoundError("No schemes found for registered user");
        }
        
        return res.json(schemeData);
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }   
});


router.post('/getSchemeDetail', async function(req, res, next) {
    try{
        console.log(req.body.posid);
        const posid = req.body.posid;
        const id = req.body.id;
        console.log(posid);
        const schemeData = await GetSchemeDetail(posid, id);
        if (schemeData == null || schemeData.length == 0){
            throw new NotFoundError("No schemes found for registered user");
        }
        return res.json(schemeData);
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }   
});
router.post('/getSchemeData', async function(req, res, next) {
    try{
        // console.log(req.body.posid);
        const searchData = req.body;
        console.log(' req.body: ',  req.body);

        // const id = req.body.id;
        // console.log(posid);
        const schemeData = await GetSchemeData(searchData);
        if (schemeData == null || schemeData.length == 0){
            throw new NotFoundError("No schemes found for registered user");
        }
        return res.json(schemeData);
    }catch(err){
        //throw new BadRequestError(err.message);
        errorResponse(err,res);
    }   
});

async function _sendOtp(req,res,stage){
    const reqData = req.body;
    const _getSmRsmMobiledata = await GetSMRSMMobileNumber(reqData.mobileNumber);
    const _getFetch = await findOneCustomer(reqData?.searchData);
    if(_getSmRsmMobiledata?.sm_mobile_no && 
        _getSmRsmMobiledata?.rsm_mobile_no && _getSmRsmMobiledata?.sm_mobile_no!=''){
        let transactionID = Date.now();
        const headers = {
            "channelID":"SEACS"
        };
        const otherData = {
            "Name":_getSmRsmMobiledata?.fos_name,
            "optionalMobile":_getFetch?.mobile_number,
            "transactionTypeID":"26"
        };
        let sendOTPData = await sendOTP(_getSmRsmMobiledata?.sm_mobile_no,transactionID,stage,headers,otherData);
        if(sendOTPData.status == HTTP_CODES.OK){
            let _sendOTPData = sendOTPData.data;
            if(_sendOTPData.esbResponse.response.responseCode == "200"){
                if(_getSmRsmMobiledata?.rsm_mobile_no!=''){
            
                    sendOTP(_getSmRsmMobiledata?.rsm_mobile_no,transactionID,"resend",headers,otherData).then((success)=>{
                        logger.info(" RSM OTP SMS IS SENT");
                    },(errr)=>{
                        loggger.error(" SOMETHING WRONG WHILE SENDING RSM OTP :"+ errr.message);
                    });
                }else{
                    logger.error(" RSM MOBILE NO IS EMPTY :"+_getSmRsmMobiledata?.rsm_mobile_no)
                }
                res.json({..._getSmRsmMobiledata,transactionID});
            }else{
                logger.error("UNAUTORIZED ERROR "+ _sendOTPData.esbResponse.response.responseDescription);
                throw new UnauthorizedError(_sendOTPData.esbResponse.response.responseDescription);
            }
            
        }else{
            logger.error("UNAUTORIZED ERROR Error in sending OTP");
            throw new UnauthorizedError("Error in sending OTP");
        }
    }else{
        throw new NotFoundError("SM/RSM Mobile No is not available for your id");
    }
}

module.exports = router;