const express = require('express');
const { UnauthorizedError } = require('../core/Error');
const logger = require('../core/Logger');
const { errorResponse } = require('../core/Response');
const { ValidateToken } = require('../services/Token');
const router = express.Router();

router.post('/validate', async function(req, res, next) {
    try{
        const isValid = await ValidateToken(req);
        if(isValid){
            res.send({valid: true});
        }else{
            logger.error("INVALID TOKEN")
            throw new UnauthorizedError("Invalid Token")
        }
        
    }catch(err){
        console.log(err);
        logger.error("validate/ ERROR :"+err.message);
        errorResponse(err,res);
    }
});

module.exports = router;