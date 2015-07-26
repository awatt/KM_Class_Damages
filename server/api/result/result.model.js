'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
    allocationType: String,
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

ResultSchema.statics.sumResults = function(resultsFIFO, resultsLIFO){
    var sumResults = {};
    var resultsByAccountFIFO = {};
    var resultsByAccountLIFO = {};
    var totalsFIFO = {
        begHoldings: 0,
        buys_class: 0,
        expenditures_class: 0,
        sales_class: 0,
        proceeds_class: 0,
        sales_classAllocated: 0,
        proceeds_classAllocated: 0,
        sharesRetained: 0,
        valueOfRetainedShares: 0,
        damages_gain: 0
    };
    var totalsLIFO = {
        begHoldings: 0,
        buys_class: 0,
        expenditures_class: 0,
        sales_class: 0,
        proceeds_class: 0,
        sales_classAllocated: 0,
        proceeds_classAllocated: 0,
        sharesRetained: 0,
        valueOfRetainedShares: 0,
        damages_gain: 0
    };

    for (var i = 0, max = resultsFIFO.length; i < max; i++){
        var elem = resultsFIFO[i];
        elem.sharesRetained = elem.buys_class - elem.sales_classAllocated;
        elem.valueOfRetainedShares = elem.sharesRetained*elem.avgClosingPrice_90Day;
        elem.damages_gain = elem.proceeds_90DayAllocated + elem.proceeds_classAllocated + (elem.sharesRetained - elem.sales_90DayAllocated)*elem.avgClosingPrice_90Day - elem.expenditures_class;
        totalsFIFO.begHoldings += elem.begHoldings;
        totalsFIFO.buys_class += elem.buys_class;
        totalsFIFO.expenditures_class += elem.expenditures_class;
        totalsFIFO.sales_class += elem.sales_class;
        totalsFIFO.proceeds_class += elem.proceeds_class;
        totalsFIFO.sales_classAllocated += elem.sales_classAllocated;
        totalsFIFO.proceeds_classAllocated += elem.proceeds_classAllocated;
        totalsFIFO.sharesRetained += elem.sharesRetained;
        totalsFIFO.valueOfRetainedShares += elem.valueOfRetainedShares;
        totalsFIFO.damages_gain += elem.damages_gain;
        resultsByAccountFIFO[elem['account']] = elem;
    }

    for (var i = 0, max = resultsLIFO.length; i < max; i++){
        var elem = resultsLIFO[i];
        elem.sharesRetained = elem.buys_class - elem.sales_classAllocated;
        elem.valueOfRetainedShares = elem.sharesRetained*elem.avgClosingPrice_90Day;
        elem.damages_gain = elem.proceeds_90DayAllocated + elem.proceeds_classAllocated + (elem.sharesRetained - elem.sales_90DayAllocated)*elem.avgClosingPrice_90Day - elem.expenditures_class;
        totalsLIFO.begHoldings += elem.begHoldings;
        totalsLIFO.buys_class += elem.buys_class;
        totalsLIFO.expenditures_class += elem.expenditures_class;
        totalsLIFO.sales_class += elem.sales_class;
        totalsLIFO.proceeds_class += elem.proceeds_class;
        totalsLIFO.sales_classAllocated += elem.sales_classAllocated;
        totalsLIFO.proceeds_classAllocated += elem.proceeds_classAllocated;
        totalsLIFO.sharesRetained += elem.sharesRetained;
        totalsLIFO.valueOfRetainedShares += elem.valueOfRetainedShares;
        totalsLIFO.damages_gain += elem.damages_gain;
        resultsByAccountLIFO[elem['account']] = elem;
    }

    sumResults['resultsByAccountFIFO'] = resultsByAccountFIFO;
    sumResults['totalsFIFO'] = totalsFIFO;
    sumResults['resultsByAccountLIFO'] = resultsByAccountLIFO;
    sumResults['totalsLIFO'] = totalsLIFO;

    console.log('this is sumResults in the model: ', sumResults)

    return sumResults;
}

module.exports = mongoose.model('Result', ResultSchema);

// [ { _id: 55b54bb975c0be6b2389c9dd,
//     allocationType: 'FIFO',
//     begHoldings: 873473,
//     account: 'Account 1',
//     buys_class: 341330,
//     expenditures_class: 11669263.1,
//     sales_class: 3644409,
//     proceeds_class: 96241121.34000006,
//     sales_classAllocated: 341330,
//     proceeds_classAllocated: 5309684.669999999,
//     sales_90DayAllocated: 0,
//     proceeds_90DayAllocated: 0,
//     sharesRetained: 0,
//     valueOfRetainedShares: 0,
//     damages_gain: 0,
//     avgClosingPrice_90Day: 0,
//     __v: 0 },
//   { _id: 55b54bb975c0be6b2389c9de,
//     allocationType: 'FIFO',
//     begHoldings: 2827618,
//     account: 'Account 2',
//     buys_class: 9378445,
//     expenditures_class: 222523950.98999992,
//     sales_class: 18426141,
//     proceeds_class: 392441149.98000014,
//     sales_classAllocated: 3314429,
//     proceeds_classAllocated: 45801306.22000001,
//     sales_90DayAllocated: 166187,
//     proceeds_90DayAllocated: 1504469.35,
//     sharesRetained: 0,
//     valueOfRetainedShares: 0,
//     damages_gain: 0,
//     avgClosingPrice_90Day: 0,
//     __v: 0 } ]