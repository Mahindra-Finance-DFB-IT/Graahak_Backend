const { RateLimiterMemory} = require('rate-limiter-flexible');
const { HTTP_CODES } = require('../Config');


const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'middleware',
    points: 10, // 10 requests
    duration: 1, 
});


const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(HTTP_CODES.TOO_MANY_REQUEST).send('Too Many Requests');
      });
  };

  module.exports = rateLimiterMiddleware;