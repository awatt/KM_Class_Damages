'use strict';

var _ = require('lodash');
var Total = require('./total.model');

// Get list of totals
exports.index = function(req, res) {
  Total.find(function (err, totals) {
    if(err) { return handleError(res, err); }
    return res.json(200, totals);
  });
};

// Get a single total
exports.show = function(req, res) {
  Total.findById(req.params.id, function (err, total) {
    if(err) { return handleError(res, err); }
    if(!total) { return res.send(404); }
    return res.json(total);
  });
};

// Creates a new total in the DB.
exports.create = function(req, res) {
  Total.create(req.body, function(err, total) {
    if(err) { return handleError(res, err); }
    return res.json(201, total);
  });
};

// Updates an existing total in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Total.findById(req.params.id, function (err, total) {
    if (err) { return handleError(res, err); }
    if(!total) { return res.send(404); }
    var updated = _.merge(total, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, total);
    });
  });
};

// Deletes a total from the DB.
exports.destroy = function(req, res) {
  Total.findById(req.params.id, function (err, total) {
    if(err) { return handleError(res, err); }
    if(!total) { return res.send(404); }
    total.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}