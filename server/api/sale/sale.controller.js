'use strict';

var _ = require('lodash');
var Socket;
var Sale = require('./sale.model');
var Buy = require('../buy/buy.model');
var Dura = require('../dura/dura.model');
var Total = require('../total/total.model');
var Result = require('../result/result.model');
var BegHolding = require('../begholding/begholding.model');
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));

// Get list of sales
exports.index = function(req, res) {
  Sale.find(function (err, sales) {
    if(err) { return handleError(res, err); }
    return res.json(200, sales);
  });
};


function allocateSale(currentSale, buysArray, classEndDate){

  var updatedBuysArray = [], allocatableSales = currentSale.allocatables;

  if(currentSale.tradeDate <= classEndDate && currentSale.transactionType === "SELL"){
    var newTotal = new Total({
      account: currentSale.account,
      buys_class: 0,
      expenditures_class: 0,
      sales_class: -currentSale.quantity,
      proceeds_class: -currentSale.quantity*currentSale.pricePerShare,
      sales_classAllocated: 0,
      proceeds_classAllocated: 0,
      sales_90DayAllocated: 0,
      proceeds_90DayAllocated: 0
    });
    updatedBuysArray.push(newTotal.saveAsync());
  }


  for (var i = 0, max = buysArray.length; i < max; i++){

    //if no allocatable sales remain, create held shares Dura object
    if (allocatableSales === 0){

      var newDura = new Dura({
        account: currentSale.account,
        tradeDate: buysArray[i].tradeDate,
        duraDate: currentSale.tradeDate,
        quantity: buysArray[i].allocatables,
        pricePerShare: buysArray[i].pricePerShare
      });

      updatedBuysArray.push(newDura.saveAsync());
    }

// -----------------------------------------------

    //IF A GIVEN BUY OR BEGHOLDING IS ALLOCATED TO ZERO BY A SALE OR WITHDRAWAL
    else if (allocatableSales < 0 && allocatableSales + buysArray[i].allocatables <= 0){

      //FOR WITHDRAWALS ALLOCATED TO BEGHOLDINGS
      //transfer begholdings over to other accounts' begholdings and adjust quantity of both 
      //by remaining amount of source account's allocatables
      if(currentSale.transactionType === "WITHDRAWAL" && buysArray[i].transactionType === "BEGHOLDINGS"){
        
        //set transferor account's begholdings allocatables to zero decrement quantityAdjusted
        updatedBuysArray.push(BegHolding.findOneAndUpdateAsync({account: buysArray[i].account}, {$set: {allocatables: 0 }, $inc: {quantityAdjusted: -buysArray[i].allocatables} }))

        //increment transferee account's begholdings quantity and allocatables
        updatedBuysArray.push(BegHolding.findOneAndUpdateAsync({account: currentSale.transferAccount}, {$inc: {allocatables: buysArray[i].allocatables, quantityAdjusted: buysArray[i].allocatables }}));



      
      //FOR WITHDRAWALS ALLOCATED TO IN-CLASS BUYS  
      } else if (currentSale.transactionType === "WITHDRAWAL") {

        //decrement buy's quantity and allocatables
        updatedBuysArray.push(Buy.findByIdAndUpdateAsync(buysArray[i]._id, {$set: {allocatables: 0 }, $inc: {quantityAdjusted: -buysArray[i].allocatables} }));

        //insert new buy into transferee account for the number of shares allocated
        var newBuy = new Buy({
          account: currentSale.transferAccount,
          buyType: "NEWBUY",
          tradeDate: currentSale.tradeDate,
          transactionType: 'BUY',
          quantity: buysArray[i].allocatables,
          quantityAdjusted: buysArray[i].allocatables,
          allocatables: buysArray[i].allocatables,
          pricePerShare: buysArray[i].pricePerShare
        });

        updatedBuysArray.push(newBuy.saveAsync());

      //FOR SALES ALLOCATED TO BEGHOLDINGS
      //decrement the allocatables for both the sale and matched begholdings by remaining amount of begholding's allocatables
      } else if(buysArray[i].transactionType === "BEGHOLDINGS"){
        updatedBuysArray.push(BegHolding.findByIdAndUpdateAsync(buysArray[i]._id, { $set: { allocatables: 0 }}));
      
      //FOR SALES ALLOCATED TO BUYS
      } else {
        //set the allocatables of the matched buy to zero
        updatedBuysArray.push(Buy.findByIdAndUpdateAsync(buysArray[i]._id, { $set: { allocatables: 0 }}));

        //update in-class and 90-day totals by the remaining amount of the buy's allocatables
        if(currentSale.tradeDate <= classEndDate){
          var newTotal = new Total({
            account: currentSale.account,
            buys_class: 0,
            expenditures_class: 0,
            sales_class: 0,
            proceeds_class: 0,
            sales_classAllocated: buysArray[i].allocatables,
            proceeds_classAllocated: buysArray[i].allocatables*currentSale.pricePerShare,
            sales_90DayAllocated: 0,
            proceeds_90DayAllocated: 0
          });
          updatedBuysArray.push(newTotal.saveAsync());
        } else {
          var newTotal = new Total({
            account: currentSale.account,
            buys_class: 0,
            proceeds_class: 0,
            expenditures_class: 0,
            sales_class: 0,
            sales_classAllocated: 0,
            proceeds_classAllocated: 0,
            sales_90DayAllocated: buysArray[i].allocatables,
            proceeds_90DayAllocated: buysArray[i].allocatables*currentSale.pricePerShare        
          });
          updatedBuysArray.push(newTotal.saveAsync());
        }
      }
      //increment sale allocations by the remaining amount of buy's allocatables
      allocatableSales += buysArray[i].allocatables;
      updatedBuysArray.push(Sale.findByIdAndUpdateAsync(currentSale._id, { $inc: { allocatables: buysArray[i].allocatables }}));
    }

// ---------------------------------------------------------------------------------------------------

    //IF A GIVEN BUY OR BEGHOLDING IS PARTIALLY ALLOCATED TO A GIVEN SALE OR WITHDRAWAL
     else if (allocatableSales < 0 && allocatableSales + buysArray[i].allocatables > 0){

      //FOR WITHDRAWALS ALLOCATED TO BEGHOLDINGS
      //transfer begholdings over to other accounts' begholdings and adjust quantity of both 
      //by remaining amount of source account's allocatables
      if(currentSale.transactionType === "WITHDRAWAL" && buysArray[i].transactionType === "BEGHOLDINGS"){
        
        //decrement transferor account's begholdings quantity and allocatables by the amount of sale's remaining allocatables
        updatedBuysArray.push(BegHolding.findOneAndUpdateAsync({account: buysArray[i].account}, {$inc: {allocatables: allocatableSales, quantityAdjusted: allocatableSales }}))

        //increment transferee account's begholdings quantity and allocatables
        updatedBuysArray.push(BegHolding.findOneAndUpdateAsync({account: currentSale.transferAccount}, {$inc: {allocatables: -allocatableSales, quantityAdjusted: -allocatableSales }}));

      
      //FOR WITHDRAWALS ALLOCATED TO IN-CLASS BUYS  
      } else if (currentSale.transactionType === "WITHDRAWAL") {

        //decrement buy's quantity and allocatables by remaining amount of sale's allocatables
        updatedBuysArray.push(Buy.findByIdAndUpdateAsync(buysArray[i]._id, {$inc: {allocatables: allocatableSales, quantityAdjusted: allocatableSales }}));

        //insert new buy into transferee account for the number of shares allocated
        var newBuy = new Buy({
          account: currentSale.transferAccount,
          buyType: "NEWBUY",
          tradeDate: currentSale.tradeDate,
          transactionType: 'BUY',
          quantity: -allocatableSales,
          quantityAdjusted: -allocatableSales,
          allocatables: -allocatableSales,
          pricePerShare: buysArray[i].pricePerShare
        });

        updatedBuysArray.push(newBuy.saveAsync());

      //FOR SALES ALLOCATED TO BEGHOLDINGS
      //decrement the allocatables for the matched begholdings by remaining amount of sale's allocatables
      } else if(buysArray[i].transactionType === "BEGHOLDINGS"){
        updatedBuysArray.push(BegHolding.findByIdAndUpdateAsync(buysArray[i]._id, { $inc: { allocatables: allocatableSales }}));
      
      //FOR SALES ALLOCATED TO BUYS
      } else {
        //decrement the allocatables of the matched buy by the remaining amount of sale's allocatables
        updatedBuysArray.push(Buy.findByIdAndUpdateAsync(buysArray[i]._id, { $inc: { allocatables: allocatableSales }}));

        //create new Dura object for remaining held buys
        var newDura = new Dura({
          account: currentSale.account,
          tradeDate: buysArray[i].tradeDate,
          duraDate: currentSale.tradeDate,
          quantity: allocatableSales + buysArray[i].allocatables,
          pricePerShare: buysArray[i].pricePerShare
        });

        updatedBuysArray.push(newDura.saveAsync());

          //update in-class and 90-day totals by the remaining amount of the buy's allocatables
        if(currentSale.tradeDate <= classEndDate){
          var newTotal = new Total({
            account: currentSale.account,
            buys_class: 0,
            expenditures_class: 0,
            sales_class: 0,
            proceeds_class: 0,
            sales_classAllocated: -allocatableSales,
            proceeds_classAllocated: -allocatableSales*currentSale.pricePerShare,
            sales_90DayAllocated: 0,
            proceeds_90DayAllocated: 0
          });
          updatedBuysArray.push(newTotal.saveAsync());
        } else {
          var newTotal = new Total({
            account: currentSale.account,
            buys_class: 0,
            expenditures_class: 0,
            sales_class: 0,
            proceeds_class: 0,
            sales_classAllocated: 0,
            proceeds_classAllocated: 0,
            sales_90DayAllocated: -allocatableSales,
            proceeds_90DayAllocated: -allocatableSales*currentSale.pricePerShare
          });
          updatedBuysArray.push(newTotal.saveAsync());
        }
      }

      //increment sale allocations by the remaining amount of buy's allocatables
      allocatableSales = 0;
      updatedBuysArray.push(Sale.findByIdAndUpdateAsync(currentSale._id, { $set: { allocatables: 0 }}));
    }
  } 
  return Promise.all(updatedBuysArray);

}

exports.generateResults = function(req, res){

  var allocationType = req.params.allocationType;
  var classEndDate = req.params.classEndDate;
  var avgClosingPrice_90Day = req.params.avgClosingPrice_90Day;
  var accounts; //get through front-end req query
  var asyncDataArray = [];
  var asyncResultsArray = [];
  var finalResultsObject = {};

  asyncDataArray.push(Total.find({}).execAsync());
  asyncDataArray.push(Buy.find({}, 'tradeDate account quantityAdjusted pricePerShare').where('tradeDate').lte(classEndDate).execAsync());
  asyncDataArray.push(BegHolding.find({}).execAsync());
  asyncDataArray.push(BegHolding.distinct("account").execAsync());
  asyncDataArray.push(Result.find({ allocationType: allocationType }).remove().execAsync());

  Promise.all(asyncDataArray)
  .then(function(returnedDataArray){
    var resultsCount = 0;
    var totals = returnedDataArray[0];
    var buys = returnedDataArray[1];
    var begHoldings = returnedDataArray[2];
    accounts = returnedDataArray[3];
    resultsCount += totals.length + buys.length + begHoldings.length;
    Socket.emit('resultsCount_total', resultsCount);

  for (var i = 0, max = accounts.length; i < max; i++){
    var newResult = new Result({
      allocationType: allocationType,
      begHoldings: 0,
      account: accounts[i],
      buys_class: 0,
      expenditures_class: 0,
      sales_class: 0,
      proceeds_class: 0,
      sales_classAllocated: 0,
      proceeds_classAllocated: 0,
      sales_90DayAllocated: 0,
      proceeds_90DayAllocated: 0,
      sharesRetained: 0,
      valueOfRetainedShares: 0,
      damages_gain: 0,
      avgClosingPrice_90Day: avgClosingPrice_90Day
    });
    finalResultsObject[accounts[i]] = newResult;
  }

    for (var i = 0, max = buys.length; i < max; i++){
      resultsCount--;
      Socket.emit('resultsCount_update', resultsCount);
      var finalResults = finalResultsObject[buys[i].account];
      var buy = buys[i];
      finalResults.buys_class += buy.quantityAdjusted;
      finalResults.expenditures_class += buy.quantityAdjusted*buy.pricePerShare;
    }

    for (var i = 0, max = totals.length;  i < max; i++){
      resultsCount--;
      Socket.emit('resultsCount_update', resultsCount);
      var finalResults = finalResultsObject[totals[i].account];
      var total = totals[i];        
      finalResults.sales_class += total.sales_class;
      finalResults.proceeds_class += total.proceeds_class;
      finalResults.sales_classAllocated += total.sales_classAllocated;
      finalResults.proceeds_classAllocated += total.proceeds_classAllocated;
      finalResults.sales_90DayAllocated += total.sales_90DayAllocated;
      finalResults.proceeds_90DayAllocated += total.proceeds_90DayAllocated;
    }

    for (var i = 0, max = begHoldings.length; i < max; i++){
      resultsCount--;
      Socket.emit('resultsCount_update', resultsCount);
      var finalResults = finalResultsObject[begHoldings[i].account];
      var begHolding = begHoldings[i];
      finalResults.begHoldings += begHolding.quantityAdjusted;
    }

    for (var key in finalResultsObject){
      if (finalResultsObject.hasOwnProperty(key)){
        asyncResultsArray.push(finalResultsObject[key].saveAsync());
      }
    }
      return Promise.all(asyncResultsArray);
  })
  .then(function(savedResultsArray){
      return res.end();
  })
  .catch(function (err) {
   console.error(err); 
 })
  .done();
}

exports.resetAllocations = function(req, res){

  Buy.find({})
  .execAsync()
  .then(function(buys){
    var buysCount = buys.length;
    var startTime = Date.now();
    Socket.emit('process_start', startTime)
    Socket.emit('resetBuysCount_total', buysCount);
    return buys.forEach(function(elem){
        if(elem.buyType === "NEWBUY"){
          Buy.removeAsync({_id: elem._id});
        } else {
        Buy.updateAsync({ _id: elem._id }, { $set: { allocatables: elem.quantity, quantityAdjusted: elem.quantity }})
      }
      buysCount--;
      Socket.emit('resetBuysCount_update', buysCount)   
      });
  })
  .then(function(){
    console.log("buys reset")
  })
  .then(function(){
    return Sale.find({})
    .execAsync()
    .then(function(sales){
      var salesCount = sales.length;
      Socket.emit('resetSalesCount_total', salesCount);
      return sales.forEach(function(elem){
          Sale.updateAsync({ _id: elem._id }, { $set: { allocatables: elem.quantity }});
          salesCount--;
          Socket.emit('resetSalesCount_total', salesCount);
        })
    })
  })
  .then(function(){
    return BegHolding.find({})
    .execAsync()
    .then(function(begHoldings){
      var begHoldingsCount = begHoldings.length;
      Socket.emit('resetbegHoldingsCount_total', begHoldingsCount);
      return begHoldings.forEach(function(elem){
          BegHolding.updateAsync({ _id: elem._id }, { $set: { allocatables: elem.quantity, quantityAdjusted: elem.quantity }});
          begHoldingsCount--;
          Socket.emit('resetbegHoldingsCount_total', begHoldingsCount);
        })
    })
  })
  .then(function(){
    Dura.removeAsync({});
  })
  .then(function(){
    Total.removeAsync({});
  })
  .then(function(){
    var endTime = Date.now();
    Socket.emit('process_complete', endTime)
    return res.end();
  })
  .catch(function (err) {
   console.error(err); 
 })
  .done();

}

exports.injectSocket = function(socket){
  Socket = socket;
}

exports.allocateSales = function(req, res){

  var classEndDate = req.params.classEndDate;
  var allocationType = req.params.allocationType;

  var saleCount;

  Sale.find({})
  .count()
  .execAsync()
  .then(function(count){

    var startTime = Date.now();
    Socket.emit('process_start', startTime)

    Socket.emit('saleCount_total', count);
    saleCount = count;
    var stream = Sale.find(
          {},
          'tradeDate allocatables account transferAccount quantity pricePerShare transactionType',
          { tradeDate: 1, allocatables: 1, _id: 0 }
        )
    .sort( { tradeDate: 1, allocatables: 1 } )
    .stream();

    stream.on('data', function(currentSale) {

      saleCount--;
      Socket.emit('saleCount_update', saleCount);

      stream.pause();

      BegHolding.findAllocatableBegHoldings(currentSale)
      .then(function(begAllocatables) {
      // console.log("ONE - begAllocatables: ", begAllocatables)
      return Buy.findAllocatableBuys(begAllocatables, currentSale);
    })
      .then(function(buysArray){

        if(allocationType === "LIFO"){
          buysArray = buysArray.reverse();
        }

        return allocateSale(currentSale, buysArray, classEndDate);
      })
      .then(function(updatedBuysArray){
        stream.resume();
      })
      .catch(function (err) {
       console.error(err); 
     })
      .done();
    })
    stream.on('error', function (err) {
      return handleError(res,err);
    })
    stream.on('close', function () {
      var endTime = Date.now();
      Socket.emit('process_complete', endTime)
      return res.end();
    })
  })
}



// Get a single sale
exports.show = function(req, res) {
  Sale.findById(req.params.id, function (err, sale) {
    if(err) { return handleError(res, err); }
    if(!sale) { return res.send(404); }
    return res.json(sale);
  });
};

// Creates a new sale in the DB.
exports.create = function(req, res) {
  Sale.create(req.body, function(err, sale) {
    if(err) { return handleError(res, err); }
    return res.json(201, sale);
  });
};

// Updates an existing sale in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sale.findById(req.params.id, function (err, sale) {
    if (err) { return handleError(res, err); }
    if(!sale) { return res.send(404); }
    var updated = _.merge(sale, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sale);
    });
  });
};

// Deletes a sale from the DB.
exports.destroy = function(req, res) {
  Sale.findById(req.params.id, function (err, sale) {
    if(err) { return handleError(res, err); }
    if(!sale) { return res.send(404); }
    sale.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}