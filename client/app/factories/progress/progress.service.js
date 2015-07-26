'use strict';

angular.module('classdamagesApp')
  .factory('progress', function (socket, $mdToast) {
    // Service logic
    // ...

    var progress = function(progressBarBase, progressBarUpdate, progressBarStart, progressBarDuration){

      console.log('this is progressBarBase: ', progressBarBase)

          var openToast =  function(minutes, seconds) {
            console.log("this is progressBarUpdate after allocation: ", progressBarUpdate)
      $mdToast.show(
        $mdToast.simple()
          .content('Completed in ' + minutes + ' minutes ' + seconds + ' seconds')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

     socket.socket.on('saleCount_total', function(saleCount){
      progressBarBase = saleCount;
            console.log('this is progressBarBase_total: ', progressBarBase)
    });

    socket.socket.on('saleCount_update', function(saleCount) {
      progressBarUpdate = Math.floor(100*(progressBarBase-saleCount)/progressBarBase);
    });

    socket.socket.on('process_start', function(startTime){
      progressBarStart = startTime;
    });

    socket.socket.on('process_complete', function(endTime) {
      var secondsFloat = (endTime - progressBarStart)/1000;
      var seconds = secondsFloat - (secondsFloat % 1);
      var minutes = seconds/60 - (seconds/60 % 1);
      progressBarDuration = minutes + ' minutes ' + seconds + ' seconds';
      openToast(minutes, seconds);
    });

    socket.socket.on('statsCount_total', function(statsCount){
      progressBarBase = statsCount;
    });

    socket.socket.on('statsCount_update', function(statsCount) {
      progressBarUpdate = Math.floor(100*(progressBarBase-statsCount)/progressBarBase);
    });

    socket.socket.on('resetBuysCount_total', function(resetBuysCount){
      progressBarBase = resetBuysCount;
    });

    socket.socket.on('resetBuysCount_update', function(resetBuysCount) {
      progressBarUpdate = Math.floor(100*(progressBarBase-resetBuysCount)/progressBarBase);
    });

    socket.socket.on('resetSalesCount_total', function(resetSalesCount){
      progressBarBase = resetSalesCount;
    });

    socket.socket.on('resetSalesCount_update', function(resetSalesCount) {
      progressBarUpdate = Math.floor(100*(progressBarBase-resetSalesCount)/progressBarBase);
    });

    socket.socket.on('resetBegHoldingsCount_total', function(resetBegHoldingsCount){
      progressBarBase = resetBegHoldingsCount;
    });

    socket.socket.on('resetBegHoldingsCount_update', function(resetBegHoldingsCount) {
      progressBarUpdate = Math.floor(100*(progressBarBase-resetBegHoldingsCount)/progressBarBase);
    });
    }

    // Public API here
    return {
      progress: progress
    };
  });
