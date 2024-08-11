const mongoose = require('mongoose');
const { Schema } = mongoose;

const Row = require('../models/row.model');
const conn = require('../dbs/init.mongodb');
const TableSchema = require('./tables.schema');
const convertToObjectId = require('../utils/convertToObjectId');

const [DOC, COL] = ['page', 'pages'];

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
            enum: ['chỉ tiêu', 'tin tức'],
            default: 'chỉ tiêu'
        },
        pageFaculty: {
            type: String,
            lowercase: true,
            validate: {
                validator: function () {
                    return this.pageType === 'chỉ tiêu';
                },
                message: 'pageFaculty is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageStudentMajor: {
            type: String,
            lowercase: true,
            validate: {
                validator: function () {
                    return this.pageType === 'chỉ tiêu';
                },
                message: 'pageStudentMajor is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageStudentCohort: {
            type: Number,
            validate: {
                validator: function () {
                    return this.pageType === 'chỉ tiêu';
                },
                message: 'pageStudentCohort is required when pageType is "Chỉ Tiêu".'
            }
        },
        pageStudentLevelYear: {
            type: Number,
            validate: {
                validator: function () {
                    return this.pageType === 'chỉ tiêu';
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

PageSchema.pre('findOneAndDelete', async function (next) {
    try {
        const { _id } = this.getQuery();
        const page = await Page.findById(_id);

        const rowValueIdList = page.tables.reduce((initialArr, table) => {
            return [...initialArr, ...table.rowValueList];
        }, []);

        await Row.deleteMany({ _id: { $in: rowValueIdList } });
        next();
    } catch (error) {
        next(error);
    }
});

PageSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const query = this.getQuery();
        const update = this.getUpdate();

        if (update?.$pull && update.$pull?.tables) {
            const tableId = update.$pull.tables._id;
            const pageId = query._id;

            const tableDetail = await Page.aggregate([
                { $match: { _id: convertToObjectId(pageId) } },
                { $unwind: '$tables' },
                { $match: { 'tables._id': convertToObjectId(tableId) } }
            ]).exec();

            await Row.deleteMany({
                _id: { $in: tableDetail[0]?.tables.rowValueList }
            });
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Page = conn.model(DOC, PageSchema);

module.exports = Page;
