const { BadRequestError, UnauthorizedError } = require('../core/Error');
const { verifyJWT } = require('../core/Jwt');
const logger = require('../core/Logger');
const Sessions = require('../models/Sessions');
const crypto = require('crypto');
const jose = require('jose');

async function ValidateToken(req){
    try{
        let validToken = false;
        const token = GetToken(req);
        const vtoken =  await verifyJWT(token);
        // console.log('vtoken' + vtoken);
        // console.log('token' + token);
        if(vtoken){
            const tokenData = jose.decodeJwt(token);
            console.log(tokenData);
            const sessions = await Sessions.findOne({
                where:{
                    username: tokenData.EntityUserName || tokenData.mobileNumber || tokenData.sapId
                },
                raw: true,
                plain: true,
            });
            if(sessions.Token === md5String(token)){
                validToken =true;
            }
        }else{
            throw new UnauthorizedError("Invalid Token")
        }
        return validToken;
    }catch(err){
        console.log(err);
        throw new UnauthorizedError("Invalid Token");   
    }
}

function GetToken(req){
    const authorization =  req.headers.authorization;
    logger.info("TOKEN : "+authorization);

    if(!authorization){
        throw new BadRequestError("Bearer Token is Empty");
    }
    //console.log(authorization);
    return authorization.split(' ')[1];
}

async function InsertToken(username,token){
    //await Sessions.sync();
    await Sessions.destroy({
        where: {
          username: username
        }
    });
    console.log('username' + username);
    console.log('token' + token);
    const data = {
        Username: username,
        Token: md5String(token),
        CreatedAt: new Date()
    };
    await Sessions.create(data);
}

function md5String(data){
   return crypto.createHash('md5').update(data).digest("hex");
}

module.exports = {
    ValidateToken,
    GetToken,
    InsertToken
}