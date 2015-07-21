'use strict';

// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema;

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BuySchema = new Schema({
	account: String,
	buyType: String,
	tradeDate: String,
	transactionType: String,
	quantity: Number,
	quantityAdjusted: Number,
	allocatables: Number,
	pricePerShare: Number
});

BuySchema.index({ tradeDate: 1, allocatables: -1 });

BuySchema.statics.findAllocatableBuys = function(begAllocatables, currentSale){
	return this.find({}, 'tradeDate allocatables account transactionType pricePerShare quantity quantityAdjusted', { tradeDate: 1, allocatables: -1, _id: 0 })
	.sort( { tradeDate: 1, allocatables: -1 } )
	  // .limit(10)
	  .where('account', currentSale.account)
	  .where('tradeDate').lte(currentSale.tradeDate)
	  .where('allocatables').gt(0)
	  .execAsync()
	  .then (function(buysArray){
	  	if (begAllocatables){
	  		buysArray.unshift(begAllocatables)
	  	}
	  	return buysArray;
	  })
}

module.exports = mongoose.model('Buy', BuySchema);