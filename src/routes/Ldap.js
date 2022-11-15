const express = require('express');
const router = express.Router();
const Joi = require("joi");
const { NotFoundError, UnauthorizedError, InternalServerError} = require("../core/Error");
const {errorResponse} = require("../core/Response");
const { HTTP_CODES, LOGIN_TYPE } = require('../Config');
const {AxiosError} = require("axios");
const { generateJWT } = require('../core/Jwt');
const { ldapAuthenticateSchema, ldapEncryptSchema } = require('../validator/Ldap');
const { authenticateLdap, encryptPassword,decryptBrowserPassword } = require('../services/Ldap');
const SmRsmFosData = require('../models/SmRsmFosData');
const { Sequelize } = require('sequelize');
const logger = require('../core/Logger');
const rateLimiterMiddleware = require('../services/RateLimiter');
const { InsertToken } = require('../services/Token');
const adminregister=require('../models/adminUserScheme')
router.use(rateLimiterMiddleware);





router.post('/authenticate', async function(req, res, next) {
    try{
        const reqData = req.body;
        const validate = ldapAuthenticateSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }
        
        let _count = await SmRsmFosData.count({
            where: {
                [Sequelize.Op.or]:[
                    {SMSAPId: reqData.EntityUserName},
                    {RSMSAPId: reqData.EntityUserName}
                ]
            },
            raw: true,
            logging: (log)=>{
                logger.debug("DB LOGGER "+log);
            }
        });
        if(_count>0){
            let browserDecryptPass = await decryptBrowserPassword(reqData.EntityUserPassword);
            logger.debug(" DECRYPTED PASSWORD "+browserDecryptPass);
            let _edata = await encryptPassword(browserDecryptPass);
            if(_edata.data.Status == "Success" && _edata.status == HTTP_CODES.OK){
                let _data = await authenticateLdap(reqData.EntityUserName,_edata.data.HashValue);
                //console.log(_data);
                if(_data.status == HTTP_CODES.OK && _data.data.Status=="Success"){
                    let _d = _data.data;
                    _d.loginType = LOGIN_TYPE.SMRSM.toString();
                    let token = await generateJWT({
                        EntityUserName:reqData.EntityUserName,
                        ..._d});
                    await InsertToken(reqData.EntityUserName,token);
    
                    res.json({token,..._d});
                }else{
                    throw new UnauthorizedError("Invalid ID or Password. Please try again.");
                }
            }else{
                throw new InternalServerError("Unable to Encrypt Password!");
            }
        }
        else{
            throw new UnauthorizedError("Access Denied. Only SMs/RSMs can access this information");
        }
    }catch(error){
        //console.log(error);
        errorResponse(error,res);
    }
});


router.post("/encrypt",async function(req,res,next){
    try{
        const reqData = req.body;
        const validate = ldapEncryptSchema.validate(reqData);
        if(Joi.isError(validate.error)){
            throw validate.error;
        }

        let _data = await encryptPassword(reqData.EntityUserPassword);
        if(_data.data.Status == "Success" && _data.status == HTTP_CODES.OK){
            res.json(_data.data);
        }else{
            throw new NotFoundError("Invalid Data");
        }
    }catch(error){
        console.log(error);
         errorResponse(error,res);
    }
})  


module.exports = router;
