const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const [DOC, COL] = ['row', 'rows'];

const RowSchema = new Schema(
    {
        page: {
            type: Schema.Types.ObjectId,
            ref: 'page'
        },
        table: Schema.Types.ObjectId,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: [
                new mongoose.Schema(
                    {
                        rowId: Schema.Types.ObjectId,
                        status: {
                            type: String,
                            enum: ['đã duyệt', 'chờ duyệt', 'từ chối', 'phải nộp lại', 'hết hạn'],
                            lowercase: true,
                            default: 'chờ duyệt'
                        },
                        proofFilesList: {
                            type: [
                                {
                                    originalName: String,
                                    fileUrl: String,
                                    fileType: String,
                                    Key: String,
                                    Bucket: String
                                }
                            ],
                            default: []
                        },
                        rowValue: {},
                        note: {
                            type: [
                                new mongoose.Schema(
                                    {
                                        value: String
                                    },
                                    { timestamps: { createdAt: true, updatedAt: false } }
                                )
                            ],
                            default: []
                        },
                        totalScore: {
                            type: Number,
                            default: 0
                        },
                        deadline: Schema.Types.Date
                    },
                    { timestamps: { createdAt: true, updatedAt: false } }
                )
            ],
            default: []
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

const Row = conn.model(DOC, RowSchema);

RowSchema.pre('deleteMany', async function (next) {
    try {
        const deletedDocs = await this.model.find(this._conditions).lean();

        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = Row;
