const express = require('express');
const { NotFoundError } = require('../core/Error');
const logger = require('../core/Logger');
const { errorResponse } = require('../core/Response');
const { GetReportData } = require('../services/Report');
const { ValidateToken, GetToken } = require('../services/Token');
const { InsertLogs } = require('../services/UserLogs');
const router = express.Router();

router.use(async (req, res, next) => {
    try{
        logger.info('Time: '+ Date.now());
        const isValid = await ValidateToken(req);
        if(isValid){
            next();
        }else{
            throw UnauthorizedError("Invalid Token")
        }
    }catch(err){
        errorResponse(err,res);
    }
});

router.post("/get",async function(req, res, next) {
    try{
        //"channelID":"SEACS",
        ////"transactionTypeID":"27"
        await InsertLogs(req, 'getReport', 1, '');
        let searchData = req.body;
        let data = await GetReportData(searchData,GetToken(req));
        if(data.length ==0){
            throw new NotFoundError("Sorry! No Data Found")
        }
        res.json(data);
    }catch(err){
        errorResponse(err,res);
    }    
});

module.exports = router;