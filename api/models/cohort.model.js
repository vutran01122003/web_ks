const conn = require("../dbs/init.mongodb");
const { Schema } = require("mongoose");

const [DOC, COL] = ["cohort", "cohorts"];

const CohortSchema = new Schema(
    {
        cohortName: {
            type: String,
            lowercase: true
        },
        currentLevelYear: {
            type: Number,
            default: 1
        },
        additionalRegisterInfo: {
            levelYear: Number,
            isActive: Boolean
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: COL
    }
);

const Cohort = conn.model(DOC, CohortSchema);

module.exports = Cohort;
