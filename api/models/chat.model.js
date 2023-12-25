const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ChatSchema = new Schema(
    {
        type: String,
        data: [
            {
                text: String
            }
        ]
    },
    {
        collection: 'chat'
    }
);

module.exports = model('chat', ChatSchema);
