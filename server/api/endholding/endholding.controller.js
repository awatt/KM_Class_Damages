'use strict';

var _ = require('lodash');
var Endholding = require('./endholding.model');

// Get list of endholdings
exports.index = function(req, res) {
  Endholding.find(function (err, endholdings) {
    if(err) { return handleError(res, err); }
    return res.json(200, endholdings);
  });
};

// Get a single endholding
exports.show = function(req, res) {
  Endholding.findById(req.params.id, function (err, endholding) {
    if(err) { return handleError(res, err); }
    if(!endholding) { return res.send(404); }
    return res.json(endholding);
  });
};

// Creates a new endholding in the DB.
exports.create = function(req, res) {
  Endholding.create(req.body, function(err, endholding) {
    if(err) { return handleError(res, err); }
    return res.json(201, endholding);
  });
};

// Updates an existing endholding in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Endholding.findById(req.params.id, function (err, endholding) {
    if (err) { return handleError(res, err); }
    if(!endholding) { return res.send(404); }
    var updated = _.merge(endholding, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, endholding);
    });
  });
};

// Deletes a endholding from the DB.
exports.destroy = function(req, res) {
  Endholding.findById(req.params.id, function (err, endholding) {
    if(err) { return handleError(res, err); }
    if(!endholding) { return res.send(404); }
    endholding.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}