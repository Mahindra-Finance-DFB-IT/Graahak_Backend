const { ValidationError } = require("joi");
const { HTTP_CODES } = require("../Config");
const { NotFoundError, InternalServerError, formatError, UnauthorizedError } = require("./Error");
const {AxiosError} = require('axios');

function errorResponse(error,res){
    igotCaught = false;
    if(error instanceof ValidationError){
        //console.log("I GOT ERROR 121",error);
        res.statusCode  = HTTP_CODES.BAD_REQUEST;
        igotCaught = true;
        res.json(formatError(error))
    }
    if(error instanceof NotFoundError){
        igotCaught = true;
        //console.log("I GOT ERROR 111",error);
        res.statusCode = (error.statusCode)?error.statusCode : HTTP_CODES.NOT_FOUND;
        res.json(getErrorMessage(error))
    }

    if(error instanceof InternalServerError){
        igotCaught = true;
        //console.log("I GOT ERROR 111",error);
        res.statusCode = (error.statusCode)?error.statusCode : HTTP_CODES.INTERNAL_SERVER_ERROR;
        res.json(getErrorMessage(error))
    }
    
    if(error instanceof AxiosError){
        igotCaught = true;
        res.statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
        res.json(getErrorMessage(error));
    }

    if(error instanceof UnauthorizedError){
        igotCaught = true;
        res.statusCode = error.statusCode;
        res.json(getErrorMessage(error));
    }

    if(!igotCaught){
        res.statusCode = HTTP_CODES.BAD_GATEWAY;
        res.json(getErrorMessage(error));
    }
}

function getErrorMessage(error){
    return {"error" : error.message}
}

module.exports ={
    errorResponse,
    getErrorMessage
}
