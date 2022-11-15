const winston = require("winston");

const logger = winston.createLogger({
    level:  'debug',
    format:  winston.format.combine(
        winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        winston.format.align(),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    ),
    transports:[
        new winston.transports.Console()
    ]

});

module.exports = logger;