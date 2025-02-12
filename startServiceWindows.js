#!/usr/bin/env node

/**
 * Module dependencies.
 */
const fs=require('fs');
const app = require('./app');
var https = require('https');
var http = require('http');


console.log("**************************start")
var privateKey  = fs.readFileSync('example.com+5-key.pem');
var certificate = fs.readFileSync('example.com+5.pem');

// var privateKey  = fs.readFileSync('key.pem');
// var certificate = fs.readFileSync('cert.pem');

var credentials = {key: privateKey, cert: certificate};



// your express configuration here

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8080, () =>{
//     console.log("serever is runing at port 8080");
//   });
// httpsServer.listen(443, () =>{
//     console.log("serever is runing at port 443");
//   });



  //openssl req -x509 -newkey rsa:2048 -keyout KEY.key -out CERT.crt -days 365 -nodes -config C:\Users\NTRNRC80S15G273K\Documents\OpenSSL-1.1.1h_win32\OpenSSL-1.1.1h_win32/openssl.cnf



/**
 * Module dependencies.
 */

const debug = require('debug')('pratarch:server');


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '443');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = https.createServer(credentials,app);

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
  let port = parseInt(val, 10);

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

  let bind = typeof port === 'string'
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
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}