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
      // Proxy the message to every other node
      for (var activePeer in peers) {
        if (peers.hasOwnProperty(activePeer) && activePeer != id) {
          peers[activePeer].sendUTF(message.utf8Data);
        }
      }
    }
  });

  // Peer disconnected
  connection.on('close', function(connection) {
    console.log(" Peer " + id + " disconnected.");
    delete peers[id];
  });

});
