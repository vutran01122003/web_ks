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
        levelYearInfo: [
            new Schema(
                {
                    levelYear: Number,
                    isActive: {
                        type: Boolean,
                        default: true
                    },
                    status: {
                        type: String,
                        enum: ["pending", "process", "done"],
                        default: "pending"
                    },
                    approvedUsers: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "user"
                        }
                    ],
                    rejectedUsers: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "user"
                        }
                    ],
                    users: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "user"
                        }
                    ]
                },
                {
                    timestamps: true
                }
            )
        ],
        approvedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        rejectedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        additionalRegisterInfo: [
            new Schema(
                {
                    levelYear: Number,
                    isActive: Boolean,
                    status: {
                        type: String,
                        enum: ["pending", "process", "done"],
                        default: "pending"
                    },
                    approvedUsers: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "user"
                        }
                    ],
                    rejectedUsers: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "user"
                        }
                    ],
                    users: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "user"
                        }
                    ]
                },
                {
                    timestamps: true
                }
            )
        ],
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
