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

    /**
     * fixedScore là thuộc tính quy định số điểm sẽ nhận được của sinh khi hoàn thành hoạt động.
     * fixedScore chỉ tồn tại khi và chỉ khi người tạo nhóm chỉ tiêu quy định các tính điểm của chỉ tiêu này là điểm số cố định.
     * Lấy một ví dụ trực quan: Cùng là "Học Lại Các Môn" nhưng có sinh viên học lại môn 4 tín, có sinh viên học lại môn 2 tín
     * Nhưng suy cho cùng thì học lại vẫn là học lại nên sinh viên học lại 4 tín cũng giống sinh viên học lại 2 tín
     * Nên điểm số khi hoàn thành hoạt động của chỉ tiêu "Học Lại Các Môn" sẽ là như nhau.
     */
    fixedScore: Number,
    isActive: {
        type: Schema.Types.Boolean,
        default: true
    }
});

module.exports = TableSchema;
