const Page = require('../models/page.model');
const Row = require('../models/row.model');
const mongoose = require('mongoose');
const createError = require('http-errors');

class RowService {
    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            let rowList = await Row.findOne({ user, table, page });
            let rowItemId = null;

            const pageData = await Page.findById(page);
            if (!pageData) throw createError.NotFound('Trang Không Tồn Tại');

            if (!rowList) {
                rowList = new Row({
                    user,
                    table,
                    page
                });

                rowList.content.push({ rowValue: JSON.parse(content) });

                rowItemId = rowList.content[rowList.content.length - 1]._id;

                await rowList.save();

                await Page.findOneAndUpdate(
                    { _id: page, 'tables._id': table },
                    {
                        $push: {
                            'tables.$.rowValueList': rowList._id
                        }
                    }
                );

                return {
                    rowList,
                    rowItemId
                };
            } else {
                const quantityDemanded = await Row.aggregate([
                    {
                        $match: {
                            table: new mongoose.Types.ObjectId(table),
                            user: new mongoose.Types.ObjectId(user),
                            page: new mongoose.Types.ObjectId(page)
                        }
                    },
                    {
                        $unwind: '$content'
                    },
                    {
                        $match: {
                            'content.status': { $in: ['Đã Duyệt', 'Chờ Duyệt'] }
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            count: 1
                        }
                    }
                ]);

                if (
                    quantityDemanded[0] &&
                    quantityDemanded[0].count === pageData.tables.id(table).quantityDemanded
                )
                    throw createError.BadRequest('Số Lượng Hoạt Động Đã Đạt Tối Đa');

                rowList = await Row.findOneAndUpdate(
                    {
                        user,
                        table,
                        page
                    },
                    {
                        $push: {
                            content: {
                                rowValue: JSON.parse(content)
                            }
                        }
                    },
                    { new: true }
                ).lean();

                rowItemId = rowList?.content[rowList.content.length - 1]._id;
            }

            return {
                rowList,
                rowItemId
            };
        } catch (error) {
            throw error;
        }
    };

    static addProofFiles = async ({ uploadedFiles, rowListId, rowItemId }) => {
        try {
            await Row.findOneAndUpdate(
                { _id: rowListId, 'content._id': rowItemId },
                {
                    $set: {
                        'content.$.proofFilesList': uploadedFiles.map((uploadedFile) => ({
                            fileId: uploadedFile.Key,
                            fileUrl: uploadedFile.Location
                        }))
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };

    static getPeddingRows = async ({ page, limit, currentPeddingRows }) => {
        let skip = (page - 1) * limit;
        const removedPeddingRows = skip - currentPeddingRows;
        if (removedPeddingRows > 0) skip = skip - removedPeddingRows;

        try {
            const peddingRows = await Row.aggregate([
                {
                    $unwind: '$content'
                },
                {
                    $match: {
                        'content.status': 'Chờ Duyệt'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        page: { $first: '$page' },
                        user: { $first: '$user' },
                        table: { $first: '$table' },
                        content: { $push: '$content' }
                    }
                },
                {
                    $lookup: {
                        from: 'pages',
                        localField: 'page',
                        foreignField: '_id',
                        as: 'page'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $skip: skip * 1
                },
                {
                    $limit: limit * 1
                },
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        table: 1,
                        'page.pageName': 1,
                        'page.tables._id': 1,
                        'page.tables.tableName': 1,
                        'page.tables.rowTitleList': 1,
                        content: 1
                    }
                }
            ]);
            return {
                code: 200,
                status: 'success',
                msg: 'Lấy dữ liệu chưa duyệt thành công',
                data: peddingRows
            };
        } catch (error) {
            throw error;
        }
    };

    static updateRowStatus = async ({ rowListId, contentIdList, status }) => {
        try {
            const updatedRow = await Row.updateMany(
                { _id: rowListId },
                {
                    'content.$[element].status': status ? 'Đã Duyệt' : 'Từ Chối'
                },
                {
                    multi: true,
                    arrayFilters: [{ 'element._id': { $in: contentIdList } }],
                    upsert: true
                }
            );

            return {
                code: 200,
                msg: `Bạn đã ${status ? 'duyệt' : 'từ chối'} chỉ tiêu`,
                data: updatedRow
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = RowService;
