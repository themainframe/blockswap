'use strict';

/**
 * @ngdoc function
 * @name blockswapClient.controller:LocalCtrl
 * @description
 * # LocalCtrl
 * Controller of the blockswapClient
 */
angular.module('blockswapClient')
  .controller('LocalCtrl', ['$scope', 'BlockStorage', function ($scope, blockStorage) {
    $scope.files = blockStorage.getAllFiles();
  }]);
