const { permissionConn } = require('../dbs/init.atlas');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const [DOC, COL] = ['role', 'roles'];

const RoleSchema = new Schema(
    {
        roleName: String,
        route: {
            type: String,
            unique: true,
            required: true
        },
        description: String
    },
    {
        collection: COL,
        timestamps: true
    }
);

const Role = permissionConn.model(DOC, RoleSchema);

module.exports = Role;
