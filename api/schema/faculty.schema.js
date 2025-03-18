const joi = require("joi");

const CreateFacultySchema = joi.object({
    body: joi.object({
        facultyName: joi.string().min(2).max(200).required().messages({
            "any.required": "Vui lòng nhập tên khoa",
            "string.max": "Tên khoa có tối đa là 200 ký tự",
            "string.min": "Tên khoa có tối thiểu là 2 ký tự"
        }),
        managerIdList: joi
            .array()
            .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
            .messages({
                "array.base": "Dữ liệu danh sách quản lý khoa không đúng định dạng",
                "string.pattern.base": "Mã quản lý khoa không đúng định dạng"
            })
    })
});

const CreateMajorListSchema = joi.object({
    params: joi.object({
        facultyId: joi
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "any.required": "Mã khoa rỗng",
                "string.pattern.base": "Mã khoa không đúng định dạng"
            })
    }),
    body: joi.object({
        majorName: joi.string().min(2).messages({
            "string.min": `Tên chuyên ngành phải lớn hơn 2 ký tự`
        }),
        managerIdList: joi
            .array()
            .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
            .messages({
                "array.base": "Dữ liệu danh sách quản lý chuyên ngành không đúng định dạng",
                "string.pattern.base": "Mã quản lý chuyên ngành không đúng định dạng"
            })
    })
});

const CreateCohortSchema = joi.object({
    params: joi.object({
        facultyId: joi
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "any.required": "Mã khoa rỗng",
                "string.pattern.base": "Mã khoa không đúng định dạng"
            }),
        majorId: joi
            .string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "any.required": "Mã chuyên ngành rỗng",
                "string.pattern.base": "Mã chuyên ngành không đúng định dạng"
            })
    }),
    body: joi.object({
        cohortName: joi.string().min(2).max(200).required().messages({
            "any.required": "Vui lòng nhập tên khóa",
            "string.max": "Tên khóa có tối đa là 200 ký tự",
            "string.min": "Tên khóa có tối thiểu là 2 ký tự"
        })
    })
});

module.exports = {
    CreateFacultySchema,
    CreateMajorListSchema,
    CreateCohortSchema
};
