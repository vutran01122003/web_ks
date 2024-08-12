const mongoose = require('mongoose');

const {
    mongodb: { port, host, database }
} = require('../config/config');

const uri = `mongodb://${host}:${port}/${database}`;
const conn = mongoose.createConnection(uri);

// conn.set('debug', true);
// conn.set('debug', { color: true });

conn.on('connected', function () {
    console.log('Connect to a MongoDB successful:::', this.name);
});

conn.on('error', function (e) {
    console.log('Mongodb error:::', JSON.stringify(e));
});

module.exports = conn;
