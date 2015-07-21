'use strict';

var _ = require('lodash');
var Begholding = require('./begholding.model');

// Get list of begholdings
exports.index = function(req, res) {
  Begholding.find(function (err, begholdings) {
    if(err) { return handleError(res, err); }
    return res.json(200, begholdings);
  });
};

// Get a single begholding
exports.show = function(req, res) {
  Begholding.findById(req.params.id, function (err, begholding) {
    if(err) { return handleError(res, err); }
    if(!begholding) { return res.send(404); }
    return res.json(begholding);
  });
};

// Creates a new begholding in the DB.
exports.create = function(req, res) {
  Begholding.create(req.body, function(err, begholding) {
    if(err) { return handleError(res, err); }
    return res.json(201, begholding);
  });
};

// Updates an existing begholding in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Begholding.findById(req.params.id, function (err, begholding) {
    if (err) { return handleError(res, err); }
    if(!begholding) { return res.send(404); }
    var updated = _.merge(begholding, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, begholding);
    });
  });
};

// Deletes a begholding from the DB.
exports.destroy = function(req, res) {
  Begholding.findById(req.params.id, function (err, begholding) {
    if(err) { return handleError(res, err); }
    if(!begholding) { return res.send(404); }
    begholding.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}