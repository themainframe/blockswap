'use strict';

describe('Service: Peer', function () {

  // load the service's module
  beforeEach(module('blockswapClient'));

  // instantiate service
  var Peer;
  beforeEach(inject(function (_Peer_) {
    Peer = _Peer_;
  }));

  it('should do something', function () {
    expect(!!Peer).toBe(true);
  });

});
