const UserLogs = require('../models/userLogs');
const { GetToken } = require('./Token');
const jose = require('jose');

async function InsertLogs(req, apiname, noTokenFound, userSapId){
    // console.log('req');
    // console.log(req.headers.authorization);
    var role = '';
    var sapId = '';
    if (noTokenFound) {
        const token = GetToken(req);
        const tokenData = jose.decodeJwt(token);
        console.log(tokenData);
        if (tokenData.EntityUserName) {
            role = 'sm';
            sapId = tokenData.EntityUserName;
        } else if (tokenData.mobileNumber) {
            role = 'se';
            sapId = tokenData.mobileNumber;
        } else if (tokenData.sapId) {
            role = 'admin';
            sapId = tokenData.sapId;
        }
    } else {
        sapId = userSapId;
    }
    if (apiname == 'adminLogin') {
        role = 'admin';
    } else if (apiname == 'seLogin' || apiname == 'seResendOtp' || apiname == 'seVerifyOtp') {
        role = 'se';
    } else if (apiname == 'smRsmLogin') {
        role = 'smRsm';
    }
    
    const data = {
        Username: sapId,
        Role: role,
        ApiName: apiname,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
    };
    await UserLogs.create(data);
}

module.exports = {
    InsertLogs
}