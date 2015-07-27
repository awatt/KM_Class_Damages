'use strict';

angular.module('classdamagesApp')
  .factory('results', function ($resource) {

    var allocationResults = $resource('api/sales/results/:allocationType/:classEndDate/:avgClosingPrice_90Day', {allocationType: '@allocationType', classEndDate: '@classEndDate', avgClosingPrice_90Day: '@avgClosingPrice_90Day'}, {
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

