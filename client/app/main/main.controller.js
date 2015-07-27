'use strict';

angular.module('classdamagesApp')
.controller('MainCtrl', function ($scope, $http, socket, $mdToast, allocate, reset, results) {

  $scope.allocationType;
  $scope.progressBarBase = 0;
  $scope.progressBarUpdate = 0;
  $scope.progressBarStart = 0;
  $scope.saleCountUpdate = 0;
  $scope.progressTimeupdate = 0
  $scope.progressBarEstimate = 0;
  $scope.progressBarDuratio = 0;
  $scope.avgTimePerSale = 0;
  $scope.classEndDate = '2014,11,14'; //user input
  $scope.resultsByAccountFIFO;
  $scope.totalsFIFO;
  $scope.resultsByAccountLIFO;
  $scope.totalsLIFO;
  $scope.avgClosingPrice_90Day = 7.52; //user input


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
      results.allocationResults.get({allocationType: $scope.allocationType, classEndDate: $scope.classEndDate, avgClosingPrice_90Day: $scope.avgClosingPrice_90Day}).$promise
      .then(function(res){
      })
    })
  };

  $scope.resetData = function(){
    reset.get().$promise
    .then(function(res){
    })
  };

  $scope.displayResults = function(){
    results.summaryResults.get().$promise
    .then(function(res){
      $scope.resultsByAccountFIFO = res.resultsByAccountFIFO;
      $scope.totalsFIFO = res.totalsFIFO;
      $scope.resultsByAccountLIFO = res.resultsByAccountLIFO;
      $scope.totalsLIFO = res.totalsLIFO;
    })
    $scope.showNextPanel($scope.currentPanel);
  };

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
    $scope.saleCountUpdate = saleCount;
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-saleCount)/$scope.progressBarBase);
    // $scope.$apply()
  });

  socket.socket.on('process_start', function(startTime){
    $scope.progressBarStart = startTime;
  });

  socket.socket.on('process_update', function(updateTime){
    $scope.progressTimeupdate = updateTime;
    $scope.avgTimePerSale = Math.floor(($scope.progressTimeupdate - $scope.progressBarStart)/($scope.progressBarBase - $scope.saleCountUpdate));
  $scope.progressBarEstimate = Math.floor($scope.avgTimePerSale*$scope.saleCountUpdate/1000);
  })

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
