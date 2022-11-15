const Joi = require("joi");
const { LOGIN_TYPE } = require("../Config");

const customerDetailsSchema = Joi.object({
    loginType: Joi.string().required(),
    searchData: Joi.string().required(),
    sapId: Joi.alternatives().conditional('loginType', { is: LOGIN_TYPE.SMRSM.toString(), then: Joi.string().required() }),
    mobileNumber: Joi.alternatives().conditional('loginType', { is: LOGIN_TYPE.SALESEXECUTIVE.toString(), then: Joi.string().required() }),
});


module.exports = {
    customerDetailsSchema
};