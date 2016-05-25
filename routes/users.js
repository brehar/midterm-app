'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/profile', User.isLoggedIn, (req, res) => {
    res.send(req.user);
});

router.get('/notSampled/:user', User.isLoggedIn, (req, res) => {
    User.find({}, (err, foundUser) => {
        res.status(err ? 400 : 200).send(err || foundUser);
    });
});

router.post('/register', (req, res) => {
    User.register(req.body, (err, user) => {
        res.status(err ? 400 : 200).send(err || user);
    });
});

router.post('/:user/saveSampled/:id', User.isLoggedIn, (req, res) => {
    User.findById(req.params.user, (err, user) => {
        user.beersSampled.push(req.params.id);
        
        user.save((err, savedUser) => {
            res.status(err ? 400 : 200).send(err || savedUser);
        });
    });
});

router.post('/:user/saveNotSampled/:name', User.isLoggedIn, (req, res) => {
    User.findById(req.params.user, (err, user) => {
        user.beersNotSampled.push(req.params.name);

        user.save((err, savedUser) => {
            res.status(err ? 400 : 200).send(err || savedUser);
        });
    });
});

router.post('/authenticate', (req, res) => {
    User.authenticate(req.body, (err, token) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.cookie('accessToken', token).send();
        }
    });
});

router.delete('/logout', (req, res) => {
    res.clearCookie('accessToken').send();
});

router.put('/toggleSampled/:user', User.isLoggedIn, (req, res) => {
    User.findById(req.params.user, (err, foundUser) => {
        if (err || !foundUser) return res.status(400).send(err);

        var index = foundUser.beersNotSampled.indexOf(req.body.beerName);
        foundUser.beersNotSampled.splice(index, 1);

        foundUser.save((err, savedUser) => {
            res.status(err ? 400 : 200).send(err || savedUser);
        });
    });
});

module.exports = router;