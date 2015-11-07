'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.Peer
 * @description
 * # Peer
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('Peer', ['$websocket', '$log', '$injector', '$window', '$interval', '$rootScope',
    function ($websocket, $log, $injector, $window, $interval, $rootScope) {

      var that = this;

      /**
       * The data stream.
       */
      this.dataStream = $websocket('ws://' + $window.location.hostname + ':1337');

      /**
       * The base command.
       * @type {{}}
       */
      var command = {
        version: '0.1'
      };

      /**
       * Mapping of handlers for the various types of protocol command we can receive
       * @type {{}}
       */
      var handlers = {
        sysinfo: $injector.get('SysinfoHandler'),
        put: $injector.get('PutHandler')
      };

      $rootScope.$on('blockWasBorn', function (event, data) {
        var block = data.block;
        that.dataStream.send(JSON.stringify(angular.extend(command, block, {
          command: 'put'
        })));
      });

      // Handle messages received from the websocket server
      this.dataStream.onMessage(function(message) {
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
