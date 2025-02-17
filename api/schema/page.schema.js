const Joi = require("joi");

const QueryPageSchema = Joi.object({
    params: Joi.object({
        pageName: Joi.string().required().messages({
            "any.required": "Tên page là bắt buộc"
        })
    }),
    query: Joi.object({
        pageStudentMajor: Joi.string().required().messages({
            "any.required": "Chuyên ngành là bắt buộc"
        }),
        pageFaculty: Joi.string().required().messages({
            "any.required": "Tên Khoa là bắt buộc"
        }),
        pageStudentCohort: Joi.string().required().messages({
            "any.required": "Khóa sinh viên là bắt buộc"
        }),
        pageStudentLevelYear: Joi.number().required().messages({
            "any.required": "Thông tin năm học của page là bắt buộc"
        })
    })
});

const QueryActivityListSchema = Joi.object({
    query: Joi.object({
        pageStudentMajor: Joi.string().required().messages({
            "any.required": "Chuyên ngành là bắt buộc"
        }),
        pageStudentCohort: Joi.string().required().messages({
            "any.required": "Khóa sinh viên là bắt buộc"
        }),
        pageStudentLevelYear: Joi.number().required().messages({
            "any.required": "Thông tin năm học của page là bắt buộc"
        }),
        pageTalentEngineerType: Joi.string().required().messages({
            "any.required": "Loại page là bắt buộc"
        })
    })
});

module.exports = {
    QueryPageSchema,
    QueryActivityListSchema
};
