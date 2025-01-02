const mongoose = require("mongoose");
const { Schema } = mongoose;

const Row = require("../models/row.model");
const conn = require("../dbs/init.mongodb");
const TableSchema = require("./tables.schema");

const { GOAL_PAGE, NEWS_PAGE, TEMPORARY_TALENT_ENGINEER_PAGE_TYPE, TALENT_ENGINEER_PAGE_TYPE } = process.env;
const [DOC, COL] = ["page", "pages"];

const PageSchema = new Schema(
    {
        pageName: {
            type: String,
            lowercase: true,
            trim: true
        },
        // Thuộc tính pageType quy định loại page của hệ thống.
        // Trong hệ thống chỉ có 2 loại page động là page "chỉ tiêu" và page "tin tức".
        // Định nghĩa: Page động là page có thể thêm, sửa, xóa và cập nhật thay vì phải fix cứng vào code front-end.
        pageType: {
            type: String,
            lowercase: true,
            enum: [GOAL_PAGE, NEWS_PAGE],
            default: GOAL_PAGE
        },
        pageTalentEngineerType: {
            type: String,
            enum: [TEMPORARY_TALENT_ENGINEER_PAGE_TYPE, TALENT_ENGINEER_PAGE_TYPE],
            validate: {
                validator: function () {
                    return this.pageType === "chỉ tiêu";
                },
                message: 'pageTalentEngineerType is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageFaculty: {
            type: String,
            lowercase: true,
            validate: {
                validator: function () {
                    return this.pageType === "chỉ tiêu";
                },
                message: 'pageFaculty is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageStudentMajor: {
            type: String,
            lowercase: true,
            validate: {
                validator: function () {
                    return this.pageType === "chỉ tiêu";
                },
                message: 'pageStudentMajor is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageStudentCohort: {
            type: Number,
            validate: {
                validator: function () {
                    return this.pageType === "chỉ tiêu";
                },
                message: 'pageStudentCohort is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageStudentLevelYear: {
            type: Number,
            validate: {
                validator: function () {
                    return this.pageType === "chỉ tiêu";
                },
                message: 'pageStudentLevelYear is required when pageType is "Chỉ Tiêu".'
            }
        },
        tables: [TableSchema],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        collection: COL,
        timestamps: true
    }
);

PageSchema.pre("findOneAndDelete", async function (next) {
    try {
        const { _id } = this.getQuery();
        const page = await Page.findById(_id);

        await Row.deleteMany({ table: { $in: page.tables.map((table) => table._id) } });
        next();
    } catch (error) {
        next(error);
    }
});

PageSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();

        if (update?.$pull && update.$pull?.tables) {
            const tableId = update.$pull.tables._id;

            await Row.deleteMany({
                table: tableId
            });
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Page = conn.model(DOC, PageSchema);

module.exports = Page;
