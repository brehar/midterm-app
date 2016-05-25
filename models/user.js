'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    beersSampled: [
        {
            type: String
        }
    ],
    beersNotSampled: [
        {
            type: String
        }
    ]
});

userSchema.statics.isLoggedIn = (req, res, next) => {
    var token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({error: 'Authentication required.'});

        User.findById(payload._id, (err, user) => {
            if (err || !user) return res.status(401).send({error: 'User not found.'});

            req.user = user;

            next();
        }).select('-password');
    });
};

userSchema.statics.register = function(userObj, cb) {
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if (err || dbUser) return cb(err || {error: 'Username not available.'});

        bcrypt.hash(userObj.password, 12, (err, hash) => {
            if (err) return cb(err);

            var user = new User({
                email: userObj.email,
                password: hash,
                firstname: userObj.firstname,
                lastname: userObj.lastname,
                image: userObj.image
            });

            user.save(cb);
        });
    });
};

userSchema.statics.authenticate = (userObj, cb) => {
    User.findOne({email: userObj.email}, (err, dbUser) => {
        if (err || !dbUser) return cb(err || {error: 'Authentication failed. Invalid email or password.'});

        bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
            if (err || !isGood) return cb(err || {error: 'Authentication failed. Invalid email or password.'});

            var token = dbUser.generateToken();

            cb(null, token);
        });
    });
};

userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };

    return jwt.sign(payload, JWT_SECRET);
};

var User = mongoose.model('User', userSchema);

module.exports = User;