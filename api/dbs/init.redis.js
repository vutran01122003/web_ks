const { createClient } = require("redis");

const client = createClient({
    url: "redis://127.0.0.1:6379"
});

client
    .on("error", (err) => {
        console.log("Redis Client Error", err);
    })
    .on("connect", function () {
        console.log("Connect to a Redis successfull");
    })
    .connect();

module.exports = client;
