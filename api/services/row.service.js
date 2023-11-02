const Page = require('../models/page.model');
const Row = require('../models/row.model');

class RowService {
    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            let rowList = await Row.findOne({ user, table, page });
            let rowItemId = null;

            if (!rowList) {
                rowList = await Row({
                    user,
                    table,
                    page
                });

                rowList.content.push({
                    rowValue: content
                });

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
            } else {
                rowList = await Row.findOneAndUpdate(
                    {
                        user,
                        table,
                        page
                    },
                    {
                        $push: {
                            content: {
                                rowValue: content
                            }
                        }
                    },
                    { new: true }
                ).lean();

                rowItemId = rowList.content[rowList.content.length - 1]._id;
            }
            return {
                rowList,
                rowItemId
            };
        } catch (error) {
            throw error;
        }
    };

    static addProofImages = async ({ uploadedImages, rowListId, rowItemId }) => {
        try {
            await Row.findOneAndUpdate(
                { _id: rowListId, 'content._id': rowItemId },
                {
                    $set: {
                        'content.$.proofImageList': uploadedImages.results
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };

    static getPeddingRows = async () => {
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

    static updateRowStatus = async ({ rowListId, rowItemId, status }) => {
        try {
            console.log({ rowListId, rowItemId, status });
            const updatedRow = await Row.findOneAndUpdate(
                { _id: rowListId, 'content._id': rowItemId },
                {
                    'content.$.status': status ? 'Đã Duyệt' : 'Từ Chối'
                },
                {
                    new: true
                }
            );

            console.log(updatedRow);

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
