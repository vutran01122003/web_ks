const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const [DOC, COL] = ['group', 'groups'];

const GroupSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
        },
        groupCode: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        method: {
            get: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'role'
                }
            ],
            post: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'role'
                }
            ],
            patch: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'role'
                }
            ],
            delete: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'role'
                }
            ]
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

const Group = conn.model(DOC, GroupSchema);

module.exports = Group;
