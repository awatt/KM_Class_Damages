'use strict';

var _ = require('lodash');
var Result = require('./result.model');


exports.summaryResults = function(req,res){
  var resultsFIFO;
  var resultsLIFO;

  Result.find({allocationType: 'FIFO'})
  .execAsync()
  .then(function(res){
    resultsFIFO = res;
    return Result.find({allocationType: 'LIFO'}).execAsync()
  })
  .then(function(res){
    resultsLIFO = res;
  })
  .then(function(){
    var finalResults = Result.sumResults(resultsFIFO, resultsLIFO);
    console.log("this is finalResults in controller: ", finalResults)
    return res.json(200, finalResults);
  })
}


// Get list of results
exports.index = function(req, res) {
  Result.find(function (err, results) {
    console.log("GOT TO BACK END - these are results: ", results)
    if(err) { return handleError(res, err); }
    return res.json(200, results);
  });
};

// Get a single result
exports.show = function(req, res) {
  Result.findById(req.params.id, function (err, result) {
    if(err) { return handleError(res, err); }
    if(!result) { return res.send(404); }
    return res.json(result);
  });
};

// Creates a new result in the DB.
exports.create = function(req, res) {
  Result.create(req.body, function(err, result) {
    if(err) { return handleError(res, err); }
    return res.json(201, result);
  });
};

// Updates an existing result in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Result.findById(req.params.id, function (err, result) {
    if (err) { return handleError(res, err); }
    if(!result) { return res.send(404); }
    var updated = _.merge(result, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, result);
    });
  });
};

// Deletes a result from the DB.
exports.destroy = function(req, res) {
  Result.findById(req.params.id, function (err, result) {
    if(err) { return handleError(res, err); }
    if(!result) { return res.send(404); }
    result.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}