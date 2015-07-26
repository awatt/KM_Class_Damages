'use strict';

angular.module('classdamagesApp')
  .factory('results', function ($resource) {

    var allocationResults = $resource('api/sales/results/:allocationType/:classEndDate', {allocationType: '@allocationType', classEndDate: '@classEndDate'}, {
        update: {
          method: 'PUT'
        }
      });

    var summaryResults = $resource('api/results/summaryResults');

    // Public API here
    return {
      allocationResults: allocationResults,
      summaryResults: summaryResults
    }
  });

