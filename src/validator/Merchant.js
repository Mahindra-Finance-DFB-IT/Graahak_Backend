const Joi = require("joi");

const merchantSchema = Joi.object({
    mobileNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    posId: Joi.string().pattern(/^[0-9]+$/).required(),
    storeId: Joi.string().pattern(/^[0-9]+$/).required(),
    fromPage: Joi.string()
});

module.exports = merchantSchema;