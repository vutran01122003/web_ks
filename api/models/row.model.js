const talentESConn = require('../dbs/init.mongodb');
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
                            enum: ['Đã Duyệt', 'Chờ Duyệt', 'Từ Chối'],
                            default: 'Chờ Duyệt'
                        },
                        proofFilesList: {
                            type: [
                                {
                                    originalName: String,
                                    fileUrl: String,
                                    fileType: String
                                }
                            ],
                            default: []
                        },
                        rowValue: {
                            type: {}
                        },
                        note: {
                            type: [
                                new mongoose.Schema(
                                    {
                                        value: String
                                    },
                                    { timestamps: true }
                                )
                            ],
                            default: []
                        }
                    },
                    {
                        timestamps: true
                    }
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

const Row = talentESConn.model(DOC, RowSchema);

RowSchema.pre('deleteMany', async function (next) {
    try {
        const deletedDocs = await this.model.find(this._conditions).lean();
        console.log(deletedDocs);

        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = Row;
