const express = require("express");
const excelController = require("../services/SchemePcg");
const upload = require("../middlewares/upload");
const router = express.Router();
const rateLimiterMiddleware = require('../services/RateLimiter');
const logger = require('../core/Logger');
const { UnauthorizedError } = require('../core/Error');
const { errorResponse } = require('../core/Response');
const { ValidateToken } = require('../services/Token');

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
router.post("/uploadpcg", upload.single("file"), excelController.upload);

module.exports = router;
