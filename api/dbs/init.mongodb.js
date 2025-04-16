const mongoose = require("mongoose");

const {
    mongodb: { uri }
} = require("../config/config");

const conn = mongoose.createConnection(uri);

conn.on("connected", function () {
    console.log(`Connect to ${this.name} successful`);
});
conn.on("error", (e) => {
    console.log(err);
});

module.exports = conn;
