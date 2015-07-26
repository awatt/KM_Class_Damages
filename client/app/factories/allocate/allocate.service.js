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

     allocate.allocateSales = function(allocationType,classEndDate){
      allocate.get({allocationType: allocationType, classEndDate: classEndDate}, function(){
        console.log("completed allocation of sales");
      });
     };

    // Public API here
    return allocate;
  });
