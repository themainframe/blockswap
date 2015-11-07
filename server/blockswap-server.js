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
var peers = {};
var peerId = 0;

// Initialise the HTTP and websocket servers
var server = http.createServer();
server.listen(webSocketsServerPort);
var wsServer = new webSocketServer({ httpServer: server });

/**
 * Register handlers
 */
var handlers = {
    put: require('./handlers/put')
};

/**
 * Register the default handler.
 * @type {exports}
 */
var defaultHandler = require('./handlers/default');

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
}, 60000);

wsServer.on('request', function(request) {

  // Accept the connection
  var id = peerId ++;
  var connection = request.accept(null, request.origin);

  // Keep track of their index to expunge them if they disconnect
  peers[id] = connection;
  console.log('Peer ' + id + ' connected');

  // Send a sysinfo packet
  connection.sendUTF(JSON.stringify(extend(command, {
    command: 'sysinfo',
    peers: id
  })));

  // Peer sent a message
  connection.on('message', function(message) {
    if (message.type === 'utf8') {

      var decodedMessage = JSON.parse(message.utf8Data);

      if (handlers.hasOwnProperty(decodedMessage.command)) {
        handlers[decodedMessage.command].handle(message, id, peers);
      } else {
        defaultHandler.handle(message, id, peers);
      }

    }
  });

  // Peer disconnected
  connection.on('close', function(connection) {
    console.log(" Peer " + id + " disconnected.");
    delete peers[id];
  });

});
