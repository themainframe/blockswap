'use strict';

/**
 * @ngdoc overview
 * @name blockswapClient
 * @description
 * # blockswapClient
 *
 * Main module of the application.
 */
angular
  .module('blockswapClient', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngWebSocket',
    'ngFileUpload',
    'LocalStorageModule'
  ])
  .run(['$rootScope', '$location', 'Peer', function ($rootScope, $location, peer) {

    $rootScope.$on('$routeChangeSuccess', function () {

      var areas = {
        local: ['/local'],
        upload: ['/upload'],
        about: ['/']
      };

      var applicationArea = null;

      // Provide the name of the "application area" we're in to $rootScope
      for (var area in areas) {
        if (areas.hasOwnProperty(area)) {

          // Does the current route start with any string for this area?
          for (var i = 0; i < areas[area].length; i ++) {
            if ($location.path().indexOf(areas[area][i]) === 0) {
              applicationArea = area;
              break;
            }
          }

          if (applicationArea !== null) {
            break;
          }
        }
      }

      $rootScope.applicationArea = applicationArea;
    });

  }])
  .config(function ($routeProvider, localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('blockswap');

    $routeProvider
      .when('/', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl',
        controllerAs: 'upload'
      })
      .when('/local', {
        templateUrl: 'views/local.html',
        controller: 'LocalCtrl',
        controllerAs: 'local'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
