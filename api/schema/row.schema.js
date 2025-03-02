const joi = require("joi");

const AddingRowSchema = joi.object({
    body: joi.object({
        rowData: joi
            .string()
            .required()
            .custom((value, helpers) => {
                try {
                    const parsedData = JSON.parse(value);

                    const rowDataSchema = joi.object({
                        faculty: joi.string().required().messages({
                            "any.required": "Không có mã khoa",
                            "string.empty": "Mã khoa không được rỗng"
                        }),
                        major: joi.string().required().messages({
                            "any.required": "Không có mã chuyên ngành",
                            "string.empty": "Mã chuyên ngành không được rỗng"
                        }),
                        cohort: joi.string().required().messages({
                            "any.required": "Không có khóa sinh viên",
                            "string.empty": "Khóa sinh viên không được rỗng"
                        }),
                        userId: joi.string().required().messages({
                            "any.required": "Không có mã sinh viên",
                            "string.empty": "Mã sinh viên không được rỗng"
                        }),
                        tableName: joi.string().required().messages({
                            "any.required": "Không có tên chỉ tiêu",
                            "string.empty": "Tên chỉ tiêu không được rỗng"
                        }),
                        user: joi.string().hex().length(24).required().messages({
                            "any.required": "Không có mã người dùng",
                            "string.empty": "Mã người dùng không được rỗng",
                            "string.hex": "Mã người dùng không hợp lệ",
                            "string.length": "Độ dài mã người dùng không hợp lệ"
                        }),
                        levelYear: joi.number().required().messages({
                            "any.required": "Không có năm sinh viên",
                            "string.empty": "Năm sinh viên không được rỗng"
                        }),
                        pageStudentLevelYear: joi.number().required().messages({
                            "any.required": "Không có năm của nhóm chỉ tiêu",
                            "string.empty": "Năm của nhóm chỉ tiêu không được rỗng"
                        }),
                        path: joi.string().required().messages({
                            "any.required": "Path không có",
                            "string.empty": "Path không được rỗng"
                        }),
                        page: joi.string().hex().length(24).messages({
                            "any.required": "Không có mã nhóm chỉ tiêu",
                            "string.empty": "Mã nhóm chỉ tiêu không được rỗng",
                            "string.hex": "Mã nhóm chỉ tiêu không hợp lệ",
                            "string.length": "Độ dài mã nhóm chỉ tiêu không hợp lệ"
                        }),
                        table: joi.string().hex().length(24).messages({
                            "any.required": "Không có mã chỉ tiêu",
                            "string.empty": "Mã chỉ tiêu không được rỗng",
                            "string.hex": "Mã chỉ tiêu không hợp lệ",
                            "string.length": "Độ dài mã chỉ tiêu không hợp lệ"
                        }),
                        content: joi
                            .string()
                            .required()
                            .custom((value, helpers) => {
                                try {
                                    JSON.parse(value);
                                    return value;
                                } catch (err) {
                                    return helpers.error("any.invalid");
                                }
                            })
                            .messages({
                                "any.required": "Nội dung minh chứng không được rỗng",
                                "any.invalid": "Nội dung minh chứng phải không hợp lệ hợp lệ"
                            })
                    });

                    const { error } = rowDataSchema.validate(parsedData);
                    if (error) return helpers.error("any.invalid", { message: error.details[0].message });

                    return value;
                } catch (err) {
                    return helpers.error("any.invalid", { message: "Dữ liệu minh chứng không hợp lệ" });
                }
            })
            .messages({
                "any.required": "Dữ liệu minh chứng không được rỗng",
                "any.invalid": "{#message}"
            })
    })
});

module.exports = { AddingRowSchema };
