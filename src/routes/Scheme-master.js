const express = require("express");
const schemeMaster = require("../services/SchemeMaster");
const upload = require("../middlewares/upload");
const rateLimiterMiddleware = require('../services/RateLimiter');
const logger = require('../core/Logger');
const { UnauthorizedError } = require('../core/Error');
const { errorResponse } = require('../core/Response');
const { ValidateToken } = require('../services/Token');
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

router.post("/uploadms", upload.single("file"), schemeMaster.upload);

module.exports = router;
