const mongoose = require("mongoose");

const {
    mongodb: { uri }
} = require("../config/config");

const conn = mongoose.createConnection(uri);

// conn.set("debug", true);
// conn.set("debug", { color: true });

conn.on("connected", function () {
    console.log(`Connect to ${this.name} successful`);
});

conn.on("error", function (e) {
    console.log("Mongodb error", JSON.stringify(e));
});

module.exports = conn;
