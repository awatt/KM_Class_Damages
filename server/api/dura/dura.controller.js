'use strict';

var _ = require('lodash');
var Dura = require('./dura.model');

// Get list of duras
exports.index = function(req, res) {
  Dura.find(function (err, duras) {
    if(err) { return handleError(res, err); }
    return res.json(200, duras);
  });
};

// Get a single dura
exports.show = function(req, res) {
  Dura.findById(req.params.id, function (err, dura) {
    if(err) { return handleError(res, err); }
    if(!dura) { return res.send(404); }
    return res.json(dura);
  });
};

// Creates a new dura in the DB.
exports.create = function(req, res) {
  Dura.create(req.body, function(err, dura) {
    if(err) { return handleError(res, err); }
    return res.json(201, dura);
  });
};

// Updates an existing dura in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Dura.findById(req.params.id, function (err, dura) {
    if (err) { return handleError(res, err); }
    if(!dura) { return res.send(404); }
    var updated = _.merge(dura, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, dura);
    });
  });
};

// Deletes a dura from the DB.
exports.destroy = function(req, res) {
  Dura.findById(req.params.id, function (err, dura) {
    if(err) { return handleError(res, err); }
    if(!dura) { return res.send(404); }
    dura.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}