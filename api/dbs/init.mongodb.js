const mongoose = require('mongoose');

const {
    mongodb: { port, host, database }
} = require('../config/config');

const uri = `mongodb://${host}:${port}/${database}`;
const conn = mongoose.createConnection(uri);

// mongoose.set('debug', true);
// mongoose.set('debug', { color: true });

mongoose.connection.on('connected', function () {
    console.log('Mongodb:::connected:::', this.name);
    return conn;
});

mongoose.connection.on('error', function (e) {
    console.log('Mongodb:::error:::', JSON.stringify(e));
});

module.exports = conn;
