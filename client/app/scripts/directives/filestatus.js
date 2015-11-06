'use strict';

/**
 * @ngdoc directive
 * @name blockswapClient.directive:fileStatus
 * @description
 * # fileStatus
 */
angular.module('blockswapClient')
  .directive('fileStatus', function () {
    return {
      template: '<div class="progress">' +
      '<div ng-repeat="zone in zones track by $index" class="progress-bar" ng-class="\'progress-bar-\' + (zone == 1 ? \'success\' : \'space\')" style="width: {{ zoneSize }}%"></div>' +
      '</div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        // Create a zero-filled array as big as the number of blocks
        scope.zones = new Array(scope.file.total + 1).join('0').split('');

        // Change any blocks we have to '1's
        for (var ownedBlockIndex = 0; ownedBlockIndex < scope.file.blocks.length; ownedBlockIndex ++) {
          var block = scope.file.blocks[ownedBlockIndex];
          scope.zones[block.seq - 1] = 1;
        }

        // How big should each zone be?
        scope.zoneSize = 100 / scope.file.total;

      }
    };
  });

