'use strict';

angular.module('classdamagesApp')
.controller('MainCtrl', function ($scope, $http, socket, $mdToast, allocate, reset, stats) {

  $scope.allocationType;
  $scope.progressBarBase = 0;
  $scope.progressBarUpdate = 0;
  $scope.progressBarStart;
  $scope.progressBarDuration;
  $scope.classEndDate = '2014,11,14';
  $scope.statsByAccountFIFO;
  $scope.totalsFIFO = {};
  $scope.statsByAccountLIFO;
  $scope.totalsLIFO = {};
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
    allocate.allocateSales($scope.allocationType, $scope.classEndDate, function(res){
    });
  };


$scope.generateResults = function(){
  stats.get({classEndDate: $scope.classEndDate})
  .$promise.then(function(stats){
    console.log("this is stats after then: ", stats)
    

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

  });
}

  $scope.displayResults = function(){
    $scope.showNextPanel($scope.currentPanel);
  };

  $scope.resetData = function(){
    reset.get(function(res){
    });
  };

  // Progress Bar Logic

  var openToast =  function(minutes, seconds) {
    console.log("this is progressBarUpdate after allocation: ", $scope.progressBarUpdate)
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

  socket.socket.on('statsCount_total', function(statsCount){
    $scope.progressBarBase = statsCount;
  });

  socket.socket.on('statsCount_update', function(statsCount) {
    $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-statsCount)/$scope.progressBarBase);
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
