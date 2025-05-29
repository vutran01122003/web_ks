const { Schema } = require("mongoose");
const conn = require("../dbs/init.mongodb");
const [DOC, COL] = ["deadline", "deadline"];

const DeadlineSchema = new Schema(
    {
        faculty: {
            type: Schema.Types.ObjectId,
            ref: "faculty"
        },
        major: {
            type: Schema.Types.ObjectId,
            ref: "major"
        },
        cohort: {
            type: Schema.Types.ObjectId,
            ref: "cohort"
        },
        talentEngineerType: {
            type: String
        },
        levelYear: {
            type: Schema.Types.Number
        },
        startDate: {
            type: Schema.Types.Date
        },
        endDate: {
            type: Schema.Types.Date
        }
    },
    {
        timeseries: true,
        collection: COL
    }
);

const Deadline = conn.model(DOC, DeadlineSchema);

module.exports = Deadline;
