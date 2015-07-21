'use strict';

var express = require('express');
var controller = require('./sale.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/byDate', controller.allocateSales);
router.get('/reset', controller.resetAllocations);
router.get('/stats', controller.generateStats);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;