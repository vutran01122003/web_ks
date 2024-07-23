const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgressSchema = new Schema({
    levelYear: Number,
    totalScore: Number,
    numberOfRequiredActivity: Number,
    numberOfPendingActivity: Number,
    numberOfAcceptedActivity: Number,
    numberOfRejectedActivity: Number,
    numberOfResubmitedActivity: Number
});

module.exports = ProgressSchema;
