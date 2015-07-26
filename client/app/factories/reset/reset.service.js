'use strict';

angular.module('classdamagesApp')
  .factory('reset', function ($resource) {
    // Service logic
    // ...

    var reset = $resource('/api/sales/reset/');

    // Public API here
    return reset;
  });
