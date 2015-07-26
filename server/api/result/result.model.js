'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
    begHoldings: Number,
    account: String,
    buys_class: Number,
    expenditures_class: Number,
    sales_class: Number,
    proceeds_class: Number,
    sales_classAllocated: Number,
    proceeds_classAllocated: Number,
    sales_90DayAllocated: Number,
    proceeds_90DayAllocated: Number,
    sharesRetained: Number,
    valueOfRetainedShares: Number,
    damages_gain: Number,
    avgClosingPrice_90Day: Number
});

module.exports = mongoose.model('Result', ResultSchema);