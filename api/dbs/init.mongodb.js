const mongoose = require("mongoose");

const {
    mongodb: { uri }
} = require("../config/config");

const conn = mongoose.createConnection(uri, {
    connectTimeoutMS: 1000 * 60 * 5
});

// mongoose.set("debug", true);
// mongoose.set("debug", { color: true });

conn.on("connected", function () {
    console.log(`Connect to ${this.name} successful`);
});

conn.on("error", function (e) {
    console.log("Mongodb error", JSON.stringify(e));
});

module.exports = conn;
