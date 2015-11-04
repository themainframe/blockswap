'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.Peer
 * @description
 * # Peer
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('Peer', ['$websocket', '$window', function ($websocket, $window) {

    this.dataStream = $websocket('ws://' + $window.location.hostname + ':1337');

    // Handle messages
    this.dataStream.onMessage(function(message) {
      var data = JSON.parse(message.data);
      console.log(data);
    });



  }]);
