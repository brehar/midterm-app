'use strict';

var express = require('express');
var router = express.Router();

router.use('/users', require('./users'));
router.use('/beers', require('./beers'));
router.use('/brewerydb', require('./brewerydb'));

module.exports = router;