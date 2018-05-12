'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const goalSchema = new mongoose.Schema({
    text: { type: String, required: true },
    done: { type: Boolean, required: true },
    count: { type: Number, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = { Goal };