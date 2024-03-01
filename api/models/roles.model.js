const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const [DOC, COL] = ['role', 'roles'];

const RoleSchema = new Schema(
    {
        url: {
            type: String,
            required: true
        },
        method: {
            type: String,
            enum: ['get', 'post', 'patch', 'delete'],
            required: true
        },
        description: {
            type: String,
            default: 'Không có mô tả'
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

const Role = conn.model(DOC, RoleSchema);

module.exports = Role;
