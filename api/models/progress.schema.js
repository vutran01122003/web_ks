const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProgressSchema = new Schema(
    {
        levelYear: {
            type: Number,
            default: 1
        },
        totalScore: {
            type: Number,
            default: 0
        },
        numberOfRequiredActivity: {
            type: Number,
            default: 0
        },
        numberOfPendingActivity: {
            type: Number,
            default: 0
        },
        numberOfAcceptedActivity: {
            type: Number,
            default: 0
        },
        numberOfAcceptedSubActivity: {
            type: Number,
            default: 0
        },
        numberOfRejectedActivity: {
            type: Number,
            default: 0
        },
        numberOfResubmitedActivity: {
            type: Number,
            default: 0
        },
        progressPercentage: {
            type: Number,
            default: 0
        },
        detailsTotalScore: Schema.Types.Mixed,
        detailsApprovedGoals: Schema.Types.Mixed,
        // isActive: false =>  The field allow we to know progress item which is created for the system logic to function properly.
        // isActive: true =>  The field allow we to know progress item which is created for progress student statistics.
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = ProgressSchema;
