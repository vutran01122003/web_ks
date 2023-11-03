const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const [DOC, COL] = ["post", "posts"];

const PostSchema = new Schema(
    {
        title: {
            type: String,
            require: true,
            unique: true,
            trim: true,
        },
        content: {
            type: String,
            require: true,
        },
        viewedFaculty: {
            type: [String],
            enum: ["All", "Faculty"],
            default: ["All"],
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        collection: COL,
        timestamps: true,
    }
);

const Post = model(DOC, PostSchema);

module.exports = Post;
