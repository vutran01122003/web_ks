const Joi = require("joi");

const registerSchema = Joi.object({
    body: Joi.object({
        userId: Joi.string().pattern(new RegExp("^[0-9]{8}$")).required().messages({
            "string.pattern.base": "Mã số sinh viên không đúng định dạng",
            "any.required": "Vui lòng nhập mã số sinh viên"
        }),
        firstName: Joi.string().min(2).max(30).required().messages({
            "string.min": "Độ dài tên tối thiểu là 2",
            "string.max": "Độ dài tên tối đa là 30",
            "any.required": "Vui lòng nhập tên sinh viên"
        }),
        lastName: Joi.string().min(2).max(30).required().messages({
            "string.min": "Độ dài họ đệm tối thiểu là 2",
            "string.max": "Độ dài họ đệm tối đa là 30",
            "any.required": "Vui lòng nhập họ đệm"
        }),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required().messages({
            "string.pattern.base": "4 <= Độ dài mật khẩu <= 30 (Không chứa ký tự đặc biệt)",
            "any.required": "Vui lòng nhập mật khẩu"
        }),
        birthday: Joi.date().less("now").required().messages({
            "any.required": "Chưa điền ngày sinh",
            "date.less": "Ngày sinh phải nhỏ hơn ngày hiện tại"
        }),
        gender: Joi.string().required().messages({
            "any.required": "Chưa chọn giới tính"
        }),
        faculty: Joi.string().required().messages({
            "any.required": "Chưa chọn khoa"
        }),
        major: Joi.string().required().messages({
            "any.required": "Chưa chọn chuyên ngành"
        }),
        cohort: Joi.string().required().messages({
            "any.required": "Chưa chọn khóa sinh viên"
        }),
        levelYear: Joi.number().required().messages({
            "any.required": "Năm học không được để trống"
        }),
        email: Joi.string().email().required().messages({
            "any.required": "Chưa nhập email",
            "string.email": "Email không đúng định dạng"
        }),
        phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required().messages({
            "any.required": "Chưa nhập số điện thoại",
            "string.pattern.base": "Độ dài số điện thoại là 10 chữ số"
        }),
        groupCode: Joi.string().optional()
    })
});

module.exports = registerSchema;
