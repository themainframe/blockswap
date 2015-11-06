'use strict';

/**
 * @ngdoc function
 * @name blockswapClient.controller:LocalCtrl
 * @description
 * # LocalCtrl
 * Controller of the blockswapClient
 */
angular.module('blockswapClient')
  .controller('LocalCtrl', ['$scope', '$window', 'BlockStorage', function ($scope, $window, blockStorage) {

    $scope.files = blockStorage.getAllFiles();

    /**
     * Download a file.
     *
     * @param fuid
     * @param file
     */
    $scope.download = function (fuid, file) {

      blockStorage.joinAndRetrieve(fuid, function (data) {
        var blob = blockStorage.decodeBase64(data, file.mime);
        saveAs(blob, file.name);
      });

    };

  }]);
