'use strict';

angular.module('classdamagesApp')
.controller('MainCtrl', function ($scope, $http, socket, $mdToast, allocate, reset, results) {

  $scope.allocationType;
  $scope.progressBarBase = 0;
  $scope.progressBarUpdate = 0;
  $scope.progressBarStart;
  $scope.progressBarDuration;
  $scope.classEndDate = '2014,11,14';
  $scope.resultsByAccountFIFO;
  $scope.totalsFIFO;
  $scope.resultsByAccountLIFO;
  $scope.totalsLIFO;
  $scope.avgClosingPrice90Day = 7.52; //user input at client interface


  // progress.progress($scope.progressBarBase, $scope.progressBarUpdate, $scope.progressBarStart, $scope.progressBarDuration)

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
    allocate.get({allocationType: $scope.allocationType, classEndDate: $scope.classEndDate}).$promise
    .then(function(res){
      console.log("this is res of allocate.get: ", res);
      results.allocationResults.get({allocationType: $scope.allocationType, classEndDate: $scope.classEndDate}).$promise
      .then(function(res){
        console.log("this is res of results.get: ", res);
      })
    })
  };

  $scope.resetData = function(){
    reset.get().$promise
    .then(function(res){
      console.log("this is the res of reset.get", res);
    })
  };

  $scope.displayResults = function(){
    results.summaryResults.get().$promise
    .then(function(res){
      $scope.resultsByAccountFIFO = res.resultsByAccountFIFO;
      console.log("this is statsByAccountFIFO: ", $scope.resultsByAccountFIFO)
      $scope.totalsFIFO = res.totalsFIFO;
      console.log("this is totalsFIFO: ", $scope.totalsFIFO)
      $scope.resultsByAccountLIFO = res.resultsByAccountLIFO;
      console.log("this is statsByAccountLIFO: ", $scope.resultsByAccountLIFO)
      $scope.totalsLIFO = res.totalsLIFO;
      console.log("this is totalsLIFO: ", $scope.totalsLIFO)
    })
    $scope.showNextPanel($scope.currentPanel);
  };

// $scope.generesults = function(){
//   stats.get({classEndDate: $scope.classEndDate})
//   .$promise.then(function(stats){
//     console.log("this is stats after then: ", stats)
    

    // for (var key in stats){
    //   if (stats.hasOwnProperty(key) && key !== "$promise" && key !== "$resolved"){
    //     console.log("this is key and stats[key]: ", key + " " + stats[key])
    //     var account = stats[key];
    //     account.sharesRetained = account.buys_class - account.sales_classAllocated;
    //     account.valueOfRetainedShares = account.sharesRetained*$scope.avgClosingPrice90Day;
    //     account.damages_gain = account.proceeds_90DayAllocated + account.proceeds_classAllocated + (account.sharesRetained - account.sales_90DayAllocated)*$scope.avgClosingPrice90Day - account.expenditures_class;  
    //     for(var key in account){
    //       if (account.hasOwnProperty(key)){
    //         var value = account[key];
    //         console.log("this is value: ", value)
    //         var totalsObject;
    //         if ($scope.allocationType === "FIFO"){
    //           totalsObject = $scope.totalsFIFO;
    //         } else {
    //           totalsObject = $scope.totalsLIFO;
    //         }
    //         totalsObject[key] += value;
    //       }
    //     }
    //     console.log("this is totalsFIFO: ", $scope.totalsFIFO)
    //   }
    // }
    // if ($scope.allocationType === 'FIFO'){
    //   $scope.statsByAccountFIFO = stats;
    // } else {
    //   $scope.statsByAccountLIFO = stats;
    // }


 



  // Progress Bar Logic

  var openToast =  function(minutes, seconds) {
    $mdToast.show(
      $mdToast.simple()
        .content('Completed in ' + minutes + ' minutes ' + seconds + ' seconds')
        .position('bottom right')
        .hideDelay(3000)
    );
  };
  
  socket.socket.on('saleCount_total', function(saleCount){
    $scope.progressBarBase = saleCount;
  });

  socket.socket.on('saleCount_update', function(saleCount) {
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-saleCount)/$scope.progressBarBase);
  });

  socket.socket.on('process_start', function(startTime){
    $scope.progressBarStart = startTime;
  });

  socket.socket.on('process_complete', function(endTime) {
    var secondsFloat = (endTime - $scope.progressBarStart)/1000;
    var seconds = secondsFloat - (secondsFloat % 1);
    var minutes = seconds/60 - (seconds/60 % 1);
    $scope.progressBarDuration = minutes + ' minutes ' + seconds + ' seconds';
    openToast(minutes, seconds);
  });

  socket.socket.on('resultsCount_total', function(resultsCount){
    $scope.progressBarBase = resultsCount;
  });

  socket.socket.on('resultsCount_update', function(resultsCount) {
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-resultsCount)/$scope.progressBarBase);
  });

  socket.socket.on('resetBuysCount_total', function(resetBuysCount){
    $scope.progressBarBase = resetBuysCount;
  });

  socket.socket.on('resetBuysCount_update', function(resetBuysCount) {
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-resetBuysCount)/$scope.progressBarBase);
  });

  socket.socket.on('resetSalesCount_total', function(resetSalesCount){
    $scope.progressBarBase = resetSalesCount;
  });

  socket.socket.on('resetSalesCount_update', function(resetSalesCount) {
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-resetSalesCount)/$scope.progressBarBase);
  });

  socket.socket.on('resetBegHoldingsCount_total', function(resetBegHoldingsCount){
    $scope.progressBarBase = resetBegHoldingsCount;
  });

  socket.socket.on('resetBegHoldingsCount_update', function(resetBegHoldingsCount) {
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-resetBegHoldingsCount)/$scope.progressBarBase);
  });


});
