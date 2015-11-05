'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.Storage
 * @description
 * # Storage
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('BlockStorage', ['localStorageService', function (localStorage) {

    this.store = function (fuid, sequenceNumber, data) {
      localStorage.set(fuid + '.' + sequenceNumber, data);
    };

  }]);
