const { createClient } = require("redis");
const {
    redis: { uri }
} = require("../config/config");

const client = createClient({
    url: uri
});

client
    .on("error", (err) => {
        console.log("Redis Client Error", err);
    })
    .on("connect", function () {
        console.log("Connect to a Redis successful");
    })
    .connect();

module.exports = client;
