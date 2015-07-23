'use strict';

angular.module('classdamagesApp')
.controller('MainCtrl', function ($scope, $http, socket, $mdToast) {

    $scope.allocationType;
    $scope.classEndDate = '2014,11,14';
    

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
      $http.get('/api/sales/byDate/' + $scope.allocationType + '/' + $scope.classEndDate).success(function(sales) {
        console.log("completed allocation")
      })  
    }

    $scope.generateStats = function(){
      $http.get('/api/sales/stats').success(function(stats) {
        console.log('stats: ', stats)
      })
    }

    $scope.resetData = function(){
      $http.get('/api/sales/reset').success(function(reset) {
      })
  }


    var openToast =  function(process) {
      $mdToast.show(
        $mdToast.simple()
          .content(process + ' Complete')
          .position('bottom right')
          .hideDelay(3000)
      );
    };


    //Progress Bar Logic
    $scope.progressBarBase = 0;
    $scope.progressBarUpdate = 0;
    
    socket.socket.on('saleCount_total', function(saleCount){
      $scope.progressBarBase = saleCount;
    });

    socket.socket.on('saleCount_update', function(saleCount) {
      $scope.progressBarUpdate = Math.floor(100*($scope.progressBarBase-saleCount)/$scope.progressBarBase);
    });

    socket.socket.on('saleCount_complete', function() {
      openToast('Allocation');
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

    socket.socket.on('reset_complete', function() {
      openToast('Data Reset');
    });


});
