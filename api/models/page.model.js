const talentESConn = require('../dbs/init.mongodb');
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

const Page = talentESConn.model(DOC, PageSchema);

module.exports = Page;
