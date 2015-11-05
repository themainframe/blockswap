"use strict";
var http = require('http');
var extend = require('extend');
process.title = 'blockswap-server';

// Port where we'll run the Websocket server
var webSocketsServerPort = 1337;

// Websocket and http servers
var webSocketServer = require('websocket').server;

// Base command
var command = {
  version: '0.1'
};

/**
 * Currently connected peers
 * @type {Array}
 */
var peers = [];

// Initialise the HTTP and websocket servers
var server = http.createServer();
server.listen(webSocketsServerPort);
var wsServer = new webSocketServer({ httpServer: server });

/**
 * Register handlers
 */
var handlers = {
    clientinfo: require('./handlers/clientinfo')
};

/**
 * Periodically send a sysinfo command to each peer.
 */
setInterval(function() {
    for (var i = 0; i < peers.length; i ++) {
        peers[i].sendUTF(JSON.stringify(extend(command, {
            command: 'sysinfo',
            peers: peers.length
        })));
    }
}, 2000);

wsServer.on('request', function(request) {

  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  // Accept the connection
  var connection = request.accept(null, request.origin);

  // Keep track of their index to expunge them if they disconnect
  var index = peers.push(connection) - 1;
  console.log((new Date()) + ' Connection accepted.');

  // Send a sysinfo packet
  connection.sendUTF(JSON.stringify(extend(command, {
    command: 'sysinfo',
    peers: peers.length
  })));

  // Peer sent a message
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
        // Handle incoming protocol message
        console.log(message);
    }
  });

  // Peer disconnected
  connection.on('close', function(connection) {
    console.log((new Date()) + " Peer disconnected.");
    // remove peer from the pool
    peers.splice(index, 1);
  });

});
