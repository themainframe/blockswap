'use strict';

describe('Directive: fileStatus', function () {

  // load the directive's module
  beforeEach(module('blockswapClient'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-status></file-status>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fileStatus directive');
  }));
});
