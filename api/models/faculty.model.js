const talentESConn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const [DOC, COL] = ['faculty', 'faculties'];

const FacultySchema = new Schema(
    {
        facultyName: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            collation: { locale: 'vi', strength: 2 }
        },
        isActive: {
            type: Schema.Types.Boolean,
            required: true
        },
        majors: [
            {
                majorName: {
                    type: String,
                    lowercase: true,
                    unique: true,
                    collation: { locale: 'vi', strength: 2 }
                },
                isActive: Schema.Types.Boolean
            }
        ]
    },
    {
        collection: COL
    }
);

const Faculty = talentESConn.model(DOC, FacultySchema);

module.exports = Faculty;
