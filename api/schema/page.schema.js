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

const PageSchema = Joi.object({
    body: Joi.object({
        pageName: Joi.string().max(200).required().messages({
            "any.required": "Vui lòng nhập tên nhóm chỉ tiêu",
            "string.max": "Tên nhóm chỉ tiêu có tối đa là 200 ký tự"
        }),
        pageType: Joi.string().required().messages({
            "any.required": "Vui lòng chọn kiểu trang (chỉ tiêu, tin tức)"
        }),
        pageFaculty: Joi.string().required().messages({
            "any.required": "Vui lòng chọn khoa"
        }),
        pageStudentMajor: Joi.string().required().messages({
            "any.required": "Vui lòng chọn chuyên ngành"
        }),
        pageStudentCohort: Joi.string().required().messages({
            "any.required": "Vui lòng chọn khóa sinh viên"
        }),
        pageTalentEngineerType: Joi.string().required().messages({
            "any.required": "Vui lòng chọn kiểu đối tượng"
        }),
        pageStudentLevelYear: Joi.number().min(1).max(15).messages({
            "number.base": "Giá trị của năm học là ký tự số",
            "number.min": "Năm học tối thiểu là 1",
            "number.max": "Năm học tối đa là 15"
        }),
        tables: Joi.array()
            .items(
                Joi.object({
                    tableName: Joi.string().max(200).required().messages({
                        "any.required": "Vui lòng nhập tên chỉ tiêu",
                        "string.max": "Tên chỉ tiêu có tối đa là 200 ký tự"
                    }),
                    quantityDemanded: Joi.number().min(1).messages({
                        "any.required": "Vui lòng nhập số lượng hoạt động",
                        "number.min": "Số lượng cần làm cho chỉ tiêu tối thiểu là 1"
                    }),
                    description: Joi.string().max(200).optional().messages({
                        "string.max": "Mô tả chỉ tiêu có tối đa là 200 ký tự"
                    }),
                    rowTitleList: Joi.array().items(
                        Joi.object({
                            titleValue: Joi.string().max(200).required().messages({
                                "any.required": "Vui lòng nhập tên cột chỉ tiêu",
                                "string.max": "Tên cột chỉ tiêu có tối đa là 200 ký tự"
                            }),
                            fixedValue: Joi.array()
                                .items(
                                    Joi.object({
                                        value: Joi.string().max(200).required().messages({
                                            "any.required": "Vui lòng nhập giá trị cột chỉ tiêu",
                                            "string.max": "Giá trị cột chỉ tiêu có tối đa là 200 ký tự"
                                        }),
                                        score: Joi.number().optional().messages({
                                            "number.base": "Điểm số của giá trị định sẵn phải là ký tự số"
                                        })
                                    })
                                )
                                .optional()
                        })
                    ),
                    fixedScore: Joi.number().allow(null).optional().messages({
                        "number.base": "Điểm số cố định phải là ký tự số"
                    })
                })
            )
            .required()
            .messages({
                "any.required": "Các chỉ tiêu chưa được tạo"
            })
    })
});

module.exports = {
    PageSchema,
    QueryPageSchema,
    QueryActivityListSchema
};
