'use strict';

var express = require('express');
var router = express.Router();

var Beer = require('../models/beer');
var User = require('../models/user');

router.get('/sampled/:user', User.isLoggedIn, (req, res) => {
    Beer.find({}).where('comments.postedBy').equals(req.params.user).exec((err, foundBeers) => {
        res.status(err ? 400 : 200).send(err || foundBeers);
    });
});

router.put('/save/:user', User.isLoggedIn, (req, res) => {
    var beer = new Beer({
        name: req.body.name,
        id: req.body.id,
        rating: [{
            text: req.body.rating,
            postedBy: req.params.user
        }],
        comments: [{
            text: req.body.comments,
            postedBy: req.params.user
        }]
    });

    beer.save((err, savedBeer) => {
        res.status(err ? 400 : 200).send(err || savedBeer);
    });
});

router.delete('/:beer', User.isLoggedIn, (req, res) => {
    Beer.findByIdAndRemove(req.params.beer, err => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send();
        }
    });
});

router.put('/:beer', User.isLoggedIn, (req, res) => {
    Beer.findByIdAndUpdate(req.params.beer, {$set: req.body}, {new: true}, (err, savedBeer) => {
        res.status(err ? 400 : 200).send(err || savedBeer);
    });
});

module.exports = router;