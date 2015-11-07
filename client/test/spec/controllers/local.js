'use strict';

describe('Controller: LocalCtrl', function () {

  // load the controller's module
  beforeEach(module('blockswapClient'));

  var LocalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LocalCtrl = $controller('LocalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LocalCtrl.awesomeThings.length).toBe(3);
  });
});
