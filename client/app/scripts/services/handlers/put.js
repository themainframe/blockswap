'use strict';

/**
 * @ngdoc service
 * @name blockswapClient.PutHandler
 * @description
 * # PutHandler
 * Service in the blockswapClient.
 */
angular.module('blockswapClient')
  .service('PutHandler', ['$log', 'BlockStorage', function ($log, BlockStorage) {

    this.handle = function (data) {
      BlockStorage.store(data);
    };

  }]);
