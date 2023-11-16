const mongoose = require('mongoose');
const { Schema } = mongoose;

const TableSchema = new Schema({
    tableName: {
        type: String,
        required: true
    },
    tableDescription: {
        type: String
    },
    rowTitleList: {
        type: [
            {
                titleValue: String,
                fixedValue: Array
            }
        ],
        default: []
    },
    quantityDemanded: {
        // Số lượng chỉ tiêu yều cầu cho một bảng
        type: Number,
        required: true
    },
    rowValueList: {
        type: [{ type: Schema.Types.ObjectId, ref: 'row' }],
        default: []
    }
});

module.exports = TableSchema;
