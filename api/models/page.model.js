const conn = require('../dbs/init.mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const TableSchema = require('./tables.schema');

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
        // Thuộc tính pageFaculty ràng buộc page chỉ xuất hiện ở trong khoa (Faculty) được chỉ định
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
        // Thuộc tính pageStudentMajor ràng buộc page chỉ xuất hiện ở trong chuyên ngành (Major) được chỉ định
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
        // Thuộc tính pageStudentCohort ràng buộc page chỉ xuất hiện ở trong khóa sinh viên (Cohort) được chỉ định
        pageStudentCohort: {
            type: Number,
            validate: {
                validator: function () {
                    return this.pageType === 'chỉ tiêu';
                },
                message: 'pageStudentCohort is required when pageType is "Chỉ Tiêu".'
            }
        },
        // Thuộc tính pageStudentLevelYear ràng buộc page chỉ xuất hiện ở trong năm học (LevelYear) được chỉ định
        // EX: Một sinh viên có ít nhất 4 năm học, mỗi năm học sẽ có các page ứng với các năm học của sinh viên
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
        // Thuộc tính isActive có chức năng cho phép người dùng tương tác với page nếu là isActive là true và ngược lại
        // Mặc định giá trị của isActive là true
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
        const Row = require('../models/row.model');
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
            const Row = require('../models/row.model');
            const tableId = update.$pull.tables._id;
            const pageId = query._id;

            const tableDetail = await Page.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(pageId) } },
                { $unwind: '$tables' },
                { $match: { 'tables._id': new mongoose.Types.ObjectId(tableId) } }
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
