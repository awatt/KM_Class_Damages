'use strict';

describe('Service: results', function () {

  // load the service's module
  beforeEach(module('classdamagesApp'));

  // instantiate service
  var results;
  beforeEach(inject(function (_results_) {
    results = _results_;
  }));

  it('should do something', function () {
    expect(!!results).toBe(true);
  });

});
