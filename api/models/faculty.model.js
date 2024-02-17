const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const [DOC, COL] = ['faculty', 'faculties'];

const FacultySchema = new Schema(
    {
        facultyName: {
            type: String,
            lowercase: true,
            required: true,
            unique: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        majors: [
            {
                majorName: {
                    type: String,
                    lowercase: true,
                    unique: true
                },
                isActive: {
                    type: Boolean,
                    default: true
                },
                cohort: [
                    {
                        cohortName: {
                            type: Number,
                            required: true
                        },
                        currentLevelYear: {
                            type: Number,
                            default: 1
                        }
                    }
                ]
            }
        ]
    },
    {
        collection: COL
    }
);

const Faculty = conn.model(DOC, FacultySchema);

module.exports = Faculty;
