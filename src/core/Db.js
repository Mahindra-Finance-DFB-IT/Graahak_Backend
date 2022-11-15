const { Sequelize } = require('sequelize');
const { DB } = require('../Config');
const logger = require('./Logger');

//const path = require('path');
const sequelize = new Sequelize({
        dialect: DB.DIALECT,
        username: DB.USERNAME,
        password: DB.PASSWORD,
        database: DB.DATABASE,
        host: DB.HOST,
        logging: true,
        logging: (log)=>{
            logger.debug(log);
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 300000,
            idle: 10000
        },
        //timezone: "+05:30",
        typeValidation: true,
        logQueryParameters: true
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



// module.exports = db;
module.exports = sequelize;

