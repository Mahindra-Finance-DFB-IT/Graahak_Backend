const { ValidationError } = require("joi");
const { HTTP_CODES } = require("../Config");

function formatError(error){
    let errors = []
    if(error instanceof ValidationError){
        error.details.forEach(err =>{
            errors.push(err.message)
        })
    }
    return {errors};
}

class NotFoundError extends Error{
    constructor(message){
        super(message);
        this.message = message;
        this.statusCode = HTTP_CODES.NOT_FOUND
    }
}

class InternalServerError extends Error{
    constructor(message){
        super(message);
        this.message = message;
        this.statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR
    }
}

class UnauthorizedError extends Error{
    constructor(message){
        super(message);
        this.message = message;
        this.statusCode = HTTP_CODES.UNAUTHORIZED
    }
}

class BadRequestError extends Error{
    constructor(message){
        super(message);
        this.message = message;
        this.statusCode = HTTP_CODES.BAD_REQUEST
    }
}

module.exports = {
    formatError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
    BadRequestError
}
