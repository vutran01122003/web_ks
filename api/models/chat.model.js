const chatbotConn = require('../dbs/init.atlas');
const mongoose = require('mongoose');
const { Schema } = mongoose;

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

module.exports = chatbotConn.model('chat', ChatSchema);
