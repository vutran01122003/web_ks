const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const [DOC, COL] = ['faculty', 'faculties'];

const FacultySchema = new Schema(
    {
        facultyName: {
            type: String,
            lowercase: true,
            unique: true
        },
        managerList: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        },
        majors: [
            {
                majorName: {
                    type: String,
                    lowercase: true
                },
                isActive: {
                    type: Boolean,
                    default: true
                },
                cohortList: [
                    new mongoose.Schema(
                        {
                            cohortName: {
                                type: Number
                            },
                            currentLevelYear: {
                                type: Number,
                                default: 1
                            }
                        },
                        {
                            timestamps: true
                        }
                    )
                ]
            }
        ]
    },
    { timestamps: true, collection: COL }
);

const Faculty = conn.model(DOC, FacultySchema);

module.exports = Faculty;
