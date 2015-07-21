'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BegholdingSchema = new Schema({
	account: String,
	tradeDate: String,
	transactionType: String,
	quantity: Number,
	quantityAdjusted: Number,
	allocatables: Number
});


BegholdingSchema.statics.findAllocatableBegHoldings = function(currentSale){
	return this.find({}, 'tradeDate allocatables account transactionType quantity quantityAdjusted')
	.execAsync()
	.then(function(data) {
		var begHolding = _.findWhere(data, { 'account': currentSale.account});
		var begAllocatables = null;
		if (begHolding.allocatables){
			begAllocatables = begHolding;
		}
		return begAllocatables;
	})
}

module.exports = mongoose.model('Begholding', BegholdingSchema);
