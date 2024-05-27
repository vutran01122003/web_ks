const mongoose = require('mongoose');
const chatbotConn = mongoose.createConnection(process.env.ATLAS_URI);

chatbotConn.on('connected', function () {
    console.log('Connect to a MongoDB successful:::', this.name);
});

chatbotConn.on('error', function (e) {
    console.log('Connect to a MongoDB successful:::', JSON.stringify(e));
});

module.exports = {
    chatbotConn
};
