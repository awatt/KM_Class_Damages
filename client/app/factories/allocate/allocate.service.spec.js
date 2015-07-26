'use strict';

describe('Service: allocate', function () {

  // load the service's module
  beforeEach(module('classdamagesApp'));

  // instantiate service
  var allocation;
  beforeEach(inject(function (_allocation_) {
    allocation = _allocation_;
  }));

  it('should do something', function () {
    expect(!!allocation).toBe(true);
  });

});
