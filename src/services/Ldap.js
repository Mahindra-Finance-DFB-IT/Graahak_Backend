const axios = require("axios");
const {  
    LDAP_AUTHENTICATE,
    LDAP_CRYPTO,
    RSA_PRIVATE_PASS_KEY,
    RSA_PUBLIC_PASS_KEY
}   = require("../Config");
const uuid = require('uuid');

const {createPrivateKey,createPublicKey} = require("crypto");
const crypto = require('crypto');

const HEADERS = {
    "x-ibm-client-id":"11b7ad16-4be0-486f-a88b-5f979574e05d"
};

async function authenticateLdap(EntityUserName,EntityUserPassword){
    try{
        return await axios({
            url: LDAP_AUTHENTICATE,
            method: 'POST',
            headers: HEADERS,
            data : {
                EntityUserName,
                EntityUserPassword
            }
        });
    }catch(err){
        throw err;
    }
}

async function encryptPassword(EntityUserPassword){
    try{
        return await axios({
            url: LDAP_CRYPTO,
            method: 'POST',
            headers: HEADERS,
            data : {
                EntityUserPassword
            }
        })
    }catch(err){
        throw err;
    }
}

async function decryptBrowserPassword(browserEncryptPass){
    const privateKey = {
        key: Buffer.from(RSA_PRIVATE_PASS_KEY, 'base64'),
        padding: crypto.constants.RSA_PKCS1_PADDING
    };
    const decryptedPassword = crypto.privateDecrypt( privateKey, Buffer.from(browserEncryptPass, 'base64'));
    return decryptedPassword.toString();
}

async function temp(){
   await decryptBrowserPassword("Sh9RQZLPjekKxepBxRy3Iwhjs5wMd+/ykx34dX73jRMN8U071O+kX5Ruo5CdtSmK+xhXo1qBqJATXb145JAdcqnn1nYeAVMNUmJqb9wAxJCUWhK2f50NE3RsJdtHoX00vpJaqJmONB6aHPI4lPr3CZWspvCGxdfU1kJe9CRv+Qo=");
}

//temp();

module.exports ={
    authenticateLdap,
    encryptPassword,
    decryptBrowserPassword
};