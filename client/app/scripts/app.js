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
    'angularFileUpload',
    'LocalStorageModule'
  ])
  .run(['Peer', function (peer) {
    // Peer init
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
      .otherwise({
        redirectTo: '/'
      });
  });
