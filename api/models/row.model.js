const mongoose = require('mongoose');
const { Schema, model } = mongoose;
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
                {
                    rowId: Schema.Types.ObjectId,
                    status: {
                        type: String,
                        enum: ['Đã Duyệt', 'Chờ Duyệt', 'Từ Chối'],
                        default: 'Chờ Duyệt'
                    },
                    proofImageList: {
                        type: [
                            {
                                proofImageId: String,
                                url: String
                            }
                        ],
                        default: []
                    },
                    rowValue: [String]
                }
            ],
            default: []
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

const Row = model(DOC, RowSchema);

module.exports = Row;
