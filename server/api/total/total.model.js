'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TotalSchema = new Schema({
    status: String,
    account: String,
    buys_class: Number,
    expenditures_class: Number,
    sales_class: Number,
    proceeds_class: Number,
    sales_classAllocated: Number,
    proceeds_classAllocated: Number,
    sales_90DayAllocated: Number, 
    proceeds_90DayAllocated: Number //need avg prices from elaine
  });

module.exports = mongoose.model('Total', TotalSchema);
