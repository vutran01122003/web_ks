const mongoose = require("mongoose");

const {
    mongodb: { uri }
} = require("../config/config");

const conn = mongoose.createConnection(uri);

conn.on("connected", function () {
    console.log(`Connect to ${this.name} successful`);
});

conn.on("error", (error) => {
    console.log(error);
});

module.exports = conn;
