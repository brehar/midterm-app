'use strict';

var express = require('express');
var router = express.Router();

var Beer = require('../models/beer');
var User = require('../models/user');

router.get('/', User.isLoggedIn, (req, res) => {
    Beer.find({}, (err, beers) => {
        res.status(err ? 400 : 200).send(err || beers);
    });
});

router.get('/:id', User.isLoggedIn, (req, res) => {
    Beer.findById(req.params.id, (err, beer) => {
        res.status(err ? 400 : 200).send(err || beer);
    });
});

router.post('/', User.isLoggedIn, (req, res) => {
    var beer = new Beer(req.body);
    
    beer.save((err, savedBeer) => {
        res.status(err ? 400 : 200).send(err || savedBeer);
    });
});

router.delete('/:id', User.isLoggedIn, (req, res) => {
    Beer.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send();
        }
    });
});

router.put('/:id', User.isLoggedIn, (req, res) => {
    Beer.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, (err, beer) => {
        res.status(err ? 400 : 200).send(err || beer);
    });
});

module.exports = router;