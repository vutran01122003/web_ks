const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProgressSchema = new Schema(
    {
        levelYear: Number,
        totalScore: Number,
        numberOfRequiredActivity: Number,
        numberOfPendingActivity: Number,
        numberOfAcceptedActivity: Number,
        numberOfRejectedActivity: Number,
        numberOfResubmitedActivity: Number,
        progressPercentage: Number,
        detailsTotalScore: Schema.Types.Mixed,
        detailsApprovedGoals: Schema.Types.Mixed,
        // isActive: false =>  The field allow we to know progress item which is created for the system logic to function properly.
        // isActive: true =>  The field allow we to know progress item which is created for progress student statistics.
        isActive: Boolean
    },
    {
        timestamps: true
    }
);

module.exports = ProgressSchema;
