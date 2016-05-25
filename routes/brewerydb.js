'use strict';

var express = require('express');
var request = require('request');

var router = express.Router();

var BEER_KEY = process.env.BEER_KEY;

router.get('/random', (req, res) => {
    request('http://api.brewerydb.com/v2/beer/random?key=' + BEER_KEY, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});

module.exports = router;