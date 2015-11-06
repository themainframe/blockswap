'use strict';

/**
 * @ngdoc function
 * @name blockswapClient.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the blockswapClient
 */
angular.module('blockswapClient')
  .controller('UploadCtrl', ['$scope', 'Upload', 'BlockStorage', function ($scope, Upload, BlockStorage) {


    $scope.uploadFile = function (file) {

        // Valid file?
        if (!file) {
            return;
        }

        Upload.dataUrl(file, true).then(function(url){

            // Splice off the MIME type
            var dataWord = url.slice(0, 4);

            if (dataWord !== 'data') {
                // Invalid file
                return;
            }

            // Get the MIME type
            var mimeType = url.slice(5, url.indexOf(';'));

            // Get the raw data
            var base64Data = url.slice(url.indexOf(','));

            // Upload the content
            BlockStorage.splitAndStore(file.name, mimeType, base64Data);
        });

    };

  }]);
