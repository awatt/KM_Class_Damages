'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EndholdingSchema = new Schema({
	account: String,
	tradeDate: String,
	transactionType: String,
	quantity: Number,
	quantityAdjusted: Number,
	allocatables: Number
});

module.exports = mongoose.model('Endholding', EndholdingSchema);