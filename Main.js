#!/usr/bin/env node

/**
 * Module dependencies.
 */

 var app = require('./src/App');
 var debug = require('debug')('backend:server');
 var http = require('http');

 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || '8000');
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 
 var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   var bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }
 
 const exitHandler = terminate(server, {	
  coredump: false,	
  timeout: 500	
})	
process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))	
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))	
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))	
process.on('SIGINT', exitHandler(0, 'SIGINT'))	

function terminate (server, options = { coredump: false, timeout: 500 }) {	
  // Exit function	
  const exit = code => {	
    options.coredump ? process.abort() : process.exit(code)	
  }	
  return (code, reason) => (err, promise) => {	
    if (err && err instanceof Error) {	
    // Log error information, use a proper logging library here :)	
    console.log(err.message, err.stack)	
    }	
    console.log("I WAS CALLED", code , reason);	
    // Attempt a graceful shutdown	
    server.close(exit)	
    setTimeout(exit, options.timeout).unref()	
  }	
}
