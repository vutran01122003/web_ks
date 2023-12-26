const mongoose = require('mongoose');
const { ATLAS_URI } = process.env;

const conn = mongoose.createConnection(ATLAS_URI);

mongoose.connection.on('connected', function () {
    console.log('Mongodb:::connected:::', this.name);
});

mongoose.connection.on('error', function (e) {
    console.log('Mongodb:::error:::', JSON.stringify(e));
});

module.exports = conn;
