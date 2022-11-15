const Joi = require("joi");

const ldapAuthenticateSchema = Joi.object({
    EntityUserName: Joi.string().required(),
    EntityUserPassword: Joi.string().required()
});

const ldapEncryptSchema = Joi.object({
    EntityUserPassword: Joi.string().required()
});

module.exports = {
    ldapAuthenticateSchema,
    ldapEncryptSchema
};