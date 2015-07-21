'use strict';

angular.module('classdamagesApp')
.controller('MainCtrl', function ($scope, $http) {

    //Panel Show Logic
    $scope.currentPanel = 0;

    $scope.showNextPanel = function(currentPanel){
        if (currentPanel<2){
          $scope.currentPanel+=1;
        }
    };
    $scope.showPrevPanel = function(){
      if ($scope.currentPanel!==0){
        $scope.currentPanel-=1;
      }
    };


  $scope.allocateSales = function(){
      $http.get('/api/sales/byDate').success(function(sales) {
        console.log("completed allocation")
      })  
    }

  $scope.generateStats = function(){
    $http.get('/api/sales/stats').success(function(sales) {
      console.log('reset allocations')
    })
  }

  $scope.resetData = function(){
    $http.get('/api/sales/reset').success(function(sales) {
      console.log('')
    })
  }

  // $http.get('/api/trades').success(function(allTrades) {

  //   console.log("got here")

  //   //temp values
  //   $scope.startDate = "2010,05,20";
  //   $scope.endDate = "2014,11,14";


  //   $scope.newStartDate = new Date($scope.startDate)
  //   $scope.newEndDate = new Date($scope.endDate)

  //   $scope.duraDates = ["2014,09,05","2014,09,08","2014,09,30","2014,10,09","2014,10,15","2014,10,17","2014,10,20","2014,10,24","2014,10,31","2014,11,07","2014,11,13","2014,11,14","2014,11,21"]

  //   //raw trade data from backend
  //   $scope.allTrades = allTrades;
  //   $scope.accounts = [];

  //   console.log("allTrades: ", allTrades)

  //   //new separate linked list each for FIFO and LIFO allocations
  //   $scope.dataListFIFO = new linkedList.List
  //   $scope.dataListLIFO = new linkedList.List


  //   // extract complete list of trading accounts for main display table and populate linked lists with raw data
  //   for (var i = 0; i < allTrades.length; i++){
  //     if ($scope.accounts.indexOf($scope.allTrades[i].account) < 0){
  //       $scope.accounts.push(allTrades[i].account);
  //     }
  //         $scope.dataListFIFO.add(allTrades[i]);
  //         $scope.dataListLIFO.add(allTrades[i]);
  //   }


  //   $scope.generateStats = function () {

  //     $scope.statsByAccountFIFO = statistics.generateFIFO($scope.dataListFIFO, $scope.accounts, $scope.startDate, $scope.endDate);
  //     $scope.statsByAccountLIFO = statistics.generateLIFO($scope.dataListLIFO, $scope.accounts, $scope.startDate, $scope.endDate);
  //     $scope.totalsFIFO = statistics.calculateTotals($scope.statsByAccountFIFO);
  //     $scope.totalsLIFO = statistics.calculateTotals($scope.statsByAccountLIFO);

  //   }


  //   $scope.displayDuraStats = function(){

  //     $scope.duraStats = statistics.generateDuraStats($scope.duraDates, $scope.statsByAccountFIFO, $scope.statsByAccountLIFO);
  //     console.log($scope.duraStats)

  //   } 



  // });

});
