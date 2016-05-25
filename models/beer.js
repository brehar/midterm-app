'use strict';

var mongoose = require('mongoose');

var beerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    rating: [
        {
            text: Number,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    comments: [
        {
            text: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
});

var Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;