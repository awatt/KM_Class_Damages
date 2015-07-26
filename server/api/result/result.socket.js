/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Result = require('./result.model');

exports.register = function(socket) {
  Result.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Result.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('result:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('result:remove', doc);
}