'use strict';

var express = require('express');
var router = express.Router();

var Beer = require('../models/beer');
var User = require('../models/user');

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

module.exports = router;