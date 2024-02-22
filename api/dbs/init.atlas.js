const mongoose = require('mongoose');

const chatbotConn = mongoose.createConnection(process.env.ATLAS_URI);
const permissionConn = mongoose.createConnection(
    'mongodb+srv://te_permission:DK3Qbbs05nJDMs4z@permission.xclliqj.mongodb.net/permission?retryWrites=true&w=majority'
);

chatbotConn.on('connected', function () {
    console.log('Connect to a MongoDB successful:::', this.name);
});

chatbotConn.on('error', function (e) {
    console.log('Connect to a MongoDB successful:::', JSON.stringify(e));
});

permissionConn.on('connected', function () {
    console.log('Connect to a MongoDB successful:::', this.name);
});

permissionConn.on('error', function (e) {
    console.log('Connect to a MongoDB successful:::', JSON.stringify(e));
});

module.exports = {
    chatbotConn,
    permissionConn
};
