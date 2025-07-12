const mongoose = require("mongoose");
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
                // Thuộc tính fixedValue quy định điểm số sẽ nhận được khi sinh viên hoàn thành với titleValue tương ứng.
                // Lấy một ví dụ trực quan Cùng một chỉ tiêu là học vượt các môn nhưng sẽ có sự khác nhau về cách tính điểm.
                // Học vượt môn 4 tín chỉ => "4 tín chỉ" sẽ là titleValue tương ứng là 20 điểm.
                // Học vượt môn 3 tín chỉ =>  "3 tín chỉ" sẽ là titleValue tương ứng là 10 điểm.
                // fixedValue chỉ tồn tại khi người tạo nhóm chỉ tiêu quy định cách tính điểm của chỉ tiêu là loại điểm số không cố định.
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
    // Số lượng hoạt động giới hạn của chỉ tiêu
    quantityDemanded: {
        type: Schema.Types.Number,
        required: true
    },
    allowExceedQuantity: {
        type: Schema.Types.Boolean,
        default: true
    },
    rowValueList: {
        type: [{ type: Schema.Types.ObjectId, ref: "row" }],
        default: []
    },
    scoreType: {
        type: String,
        enum: ["fixed", "dynamic"]
    },
    fixedScore: Number,
    isActive: {
        type: Schema.Types.Boolean,
        default: true
    },
    totalScore: {
        type: Number,
        default: 0
    }
});

module.exports = TableSchema;
