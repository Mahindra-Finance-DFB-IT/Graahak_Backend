const Joi = require("joi");

const otpSchema = Joi.object({
    mobileNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    transactionID: Joi.string().required()
}).unknown(true);

const verifyOtpSchema = Joi.object({
    mobileNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    transactionID: Joi.string().required(),
    otp: Joi.string().length(4).pattern(/^[0-9]+$/).required(),
    fromPage: Joi.string()
});

const verifySmRSMOtpSchema = Joi.object({
    mobileNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    transactionID: Joi.string().required(),
    otp: Joi.string().length(4).pattern(/^[0-9]+$/).required()
}).unknown(true);
module.exports = {
    otpSchema,
    verifyOtpSchema,
    verifySmRSMOtpSchema
}