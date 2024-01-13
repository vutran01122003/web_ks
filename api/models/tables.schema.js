const mongoose = require('mongoose');
const { Schema } = mongoose;

const TableSchema = new Schema({
    tableName: {
        type: String,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        lowercase: true
    },
    rowTitleList: {
        type: [
            {
                titleValue: String,
                fixedValue: [
                    {
                        value: String,
                        score: Schema.Types.Number
                    }
                ]
            }
        ],
        default: []
    },
    quantityDemanded: {
        // Số lượng chỉ tiêu yều cầu cho một bảng
        type: Schema.Types.Number,
        required: true
    },
    rowValueList: {
        type: [{ type: Schema.Types.ObjectId, ref: 'row' }],
        default: []
    },
    fixedScore: Number,
    isActive: {
        type: Schema.Types.Boolean,
        default: true
    }
});

module.exports = TableSchema;
