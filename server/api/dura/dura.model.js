'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DuraSchema = new Schema({
  account: String,
  tradeDate: String,
  duraDate: String,
  quantity: Number,
  pricePerShare: Number
});

DuraSchema.index({ duraDate: 1, tradeDate: 1, account: 1 });

module.exports = mongoose.model('Dura', DuraSchema);