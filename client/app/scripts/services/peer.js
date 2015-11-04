'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.Peer
 * @description
 * # Peer
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('Peer', ['$websocket', '$log', '$injector', '$window', function ($websocket, $log, $injector, $window) {

    var dataStream = $websocket('ws://' + $window.location.hostname + ':1337');

    /**
     * Mapping of handlers for the various types of protocol command we can receive
     * @type {{}}
     */
    var handlers = {
      sysinfo: $injector.get('SysinfoHandler')
    };

    // Handle messages
    dataStream.onMessage(function(message) {
      var data = JSON.parse(message.data);
      if (data.hasOwnProperty('command')) {
        var command = data.command;
        $log.info('received command: ' + command);
        // Check if we have a handler for this type of message
        if (handlers.hasOwnProperty(command)) {
          handlers[command].handle(data);
        }
      }
    });

  }]);
