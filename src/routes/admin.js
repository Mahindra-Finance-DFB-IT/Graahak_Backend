const express = require("express");
// const app = express();
// const db = require("./modelss");
const {errorResponse} = require("../core/Response");
const { NotFoundError, UnauthorizedError, InternalServerError} = require("../core/Error");
const { generateJWT } = require('../core/Jwt');
const router = express.Router();
const { Admin_Role } = require("../scheme_models");
const { authenticateLdap, encryptPassword, decryptBrowserPassword } = require('../services/Ldap');
const bcrypt = require("bcrypt");
const { Sequelize } = require('sequelize');
const logger = require('../core/Logger');
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("../../JWT");
const { HTTP_CODES, LOGIN_TYPE } = require('../Config');
const { InsertToken } = require('../services/Token');
// app.use(express.json());
// app.use(cookieParser());

router.post("/register", (req, res) => {
    const { sapId, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Admin_Role.create({
            sapId: sapId,
            password: hash,
        })
            .then(() => {
                res.json("USER REGISTERED");
            })
            .catch((err) => {
                if (err) {
                    res.status(400).json({ error: err });
                }
            });
    });
});



// router.get('/logout',function(req,res,next){
//   req.logout();
//   return res.status(200).json({message:'Logout Successful'});
// });
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
router.post("/login", async (req, res) => {
    // const { sapId, password } = req.body;
   try{
    const reqData = req.body;
    console.log(reqData.password);
    // const user = await Users.findOne({ where: { sapId: reqData.sapId } });
    let count = await Admin_Role.count({
        where: {
            [Sequelize.Op.or]: [
                { sapId: reqData.sapId }
            ]
        },
        raw: true,
        logging: (log) => {
            logger.debug("DB LOGGER " + log);
        }
    });
    console.log(count);
    if (count > 0) {
        let browserDecryptPass = await decryptBrowserPassword(reqData.password);
        logger.debug(" DECRYPTED PASSWORD " + browserDecryptPass);
        let _edata = await encryptPassword(browserDecryptPass);
        if (_edata.data.Status == "Success" && _edata.status == HTTP_CODES.OK) {
            let _data = await authenticateLdap(reqData.sapId, _edata.data.HashValue);
            console.log(_data);
            if (_data.status == HTTP_CODES.OK && _data.data.Status == "Success") {
                let _d = _data.data;
                _d.loginType = LOGIN_TYPE.SMRSM.toString();
                let token = await generateJWT({
                    sapId: reqData.sapId,
                    ..._d
                });
                // await InsertToken(reqData.sapId,token);

                res.json({ token, ..._d });
            } else {
                throw new UnauthorizedError("Invalid ID or Password. Please try again.");
            }
        } else {
            throw new InternalServerError("Unable to Encrypt Password!");
        }
    } else {
        res.status(400).json({ error: "Access Denied. Only Admins can access this page." });

    }
}catch(error){
        //console.log(error);
        errorResponse(error,res);
    }

});

router.get("/profile", validateToken, (req, res) => {
    res.json("profile");
});

// db.sequelize.sync().then(() => {
//   app.listen(3001, () => {
//     console.log("SERVER RUNNING ON PORT 3001");
//   });
// });
module.exports = router;