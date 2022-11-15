const jose = require('jose');
const {createPublicKey, createPrivateKey} = require("crypto");
const { UnauthorizedError } = require('./Error');
// openssl ecparam --name prime256v1 -genkey -noout -out private.ec.key
// openssl ec -in private.ec.key -pubout -out public.pem
const encodePrivateKey = `LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSU5wYkphNHBWZHhVK1p1YVhv
SWRUV1BpSFdzZThZb2VKdklPT2ZWKzJYVEFvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFRkNJc0Jy
aUZ3YUh5S3NhenhRN25KU0E1ZzRzZnJZZDdXMDFmb2JpR0VQbWtEVXhDRUVVVwpSS09TWWtpcEJI
TmJCVUFYYVJaazAyVnZ0UnI4TEdDRXV3PT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=`;

const encodePublicKey = `LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFR
Y0RRZ0FFRkNJc0JyaUZ3YUh5S3NhenhRN25KU0E1ZzRzZgpyWWQ3VzAxZm9iaUdFUG1rRFV4Q0VF
VVdSS09TWWtpcEJITmJCVUFYYVJaazAyVnZ0UnI4TEdDRXV3PT0KLS0tLS1FTkQgUFVCTElDIEtF
WS0tLS0tCg==`;

const CLAIM = "urn:mahindrafinance:claim";
const ISSUER  = "urn:mahindrafinance:issuer";
const AUDIENCE  = "urn:mahindrafinance:audience";
const EXP = "10m";
const ALG ="ES256";
const privateKey =  createPrivateKey(Buffer.from(encodePrivateKey, 'base64').toString('ascii'));
const publicKey = createPublicKey(Buffer.from(encodePublicKey, 'base64').toString('ascii'));


async function generateJWT(data){
    const token = await new jose.SignJWT(data)
                .setProtectedHeader({ alg: ALG })
                .setIssuedAt()
                .setIssuer(ISSUER)
                .setAudience(AUDIENCE)
                .setExpirationTime(EXP)
                .sign(privateKey);
    return token;
}


async function verifyJWT(jwt){
    try{
    return  await jose.jwtVerify(jwt, publicKey, {
        issuer: ISSUER,
        audience: AUDIENCE,
      });
    }catch(err){
        throw new UnauthorizedError(err.message);
    }
}

module.exports = {
    generateJWT,
    verifyJWT
}

