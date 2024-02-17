const { createClient } = require('redis');

const client = createClient();

client
    .on('error', (err) => {
        console.log('Redis Client Error', err);
    })
    .on('connect', function () {
        console.log('Connect to a Redis successfull');
    })
    .connect();

module.exports = client;
