'use strict';

angular.module('classdamagesApp')
  .factory('stats', function ($resource) {
    // Service logic
    // ...

    var stats = $resource('api/sales/stats/:classEndDate', {classEndDate: '@classEndDate'}, {
        update: {
          method: 'PUT'
        }
      });

    // Public API here
    return stats;
  });