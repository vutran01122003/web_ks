const mongoose = require("mongoose");

function convertToObjectId(id) {
    return new mongoose.Types.ObjectId(id);
}

module.exports = convertToObjectId;
