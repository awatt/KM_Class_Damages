'use strict';

var express = require('express');
var controller = require('./sale.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/byDate/:allocationType/:classEndDate', controller.allocateSales);
router.get('/reset', controller.resetAllocations);
router.get('/results/:allocationType/:classEndDate/:avgClosingPrice_90Day', controller.generateResults);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;