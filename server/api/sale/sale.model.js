'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema;

// mongoose.set('debug', true)

var SaleSchema = new Schema({
	account: String,
	tradeDate: String,
	transactionType: String,
	transferAccount: String,
	quantity: Number,
	allocatables: Number,
	pricePerShare: Number
});

SaleSchema.index({ tradeDate: 1, allocatables: 1 });

module.exports = mongoose.model('Sale', SaleSchema);