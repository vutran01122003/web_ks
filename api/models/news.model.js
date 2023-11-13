const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const [DOC, COL] = ['news', 'news'];

const NewsSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        summary: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        viewedFaculty: {
            type: [String],
            enum: ['All', 'Faculty'],
            default: ['All']
        },
        cover: {
            imageId: String,
            url: String
        },
        newsType: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

const News = model(DOC, NewsSchema);

module.exports = News;
