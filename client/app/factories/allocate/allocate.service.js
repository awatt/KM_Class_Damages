'use strict';

angular.module('classdamagesApp')
  .factory('allocate', function ($resource) {

     var allocate = $resource('api/sales/byDate/:allocationType/:classEndDate', 
      {allocationType: '@allocationType', classEndDate: '@classEndDate'},
      {
      update: {
        method: 'PUT'
      }
    });

    // Public API here
    return allocate;
  });
