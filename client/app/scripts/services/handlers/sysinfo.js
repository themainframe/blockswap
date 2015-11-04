'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.SysinfoHandler
 * @description
 * # SysinfoHandler
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('SysinfoHandler', ['$log', function ($log) {

    this.handle = function (data) {
      $log.info('sysinfo: ' + data.peers + ' online peer' + (data.peers > 1 ? 's' : ''));
    };

  }]);
