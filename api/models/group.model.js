const { permissionConn } = require('../dbs/init.atlas');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const [DOC, COL] = ['group', 'groups'];

const GroupSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        description: String,
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: 'role'
            }
        ]
    },
    {
        collection: COL,
        timestamps: true
    }
);

const Group = permissionConn.model(DOC, GroupSchema);

module.exports = Group;
