const Page = require('../models/page.model');
const Row = require('../models/row.model');
const mongoose = require('mongoose');
const createError = require('http-errors');

class RowService {
    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            const contentObj = JSON.parse(content);

            let rowList = await Row.findOne({ user, table, page });
            let rowItemId = null;
            let totalScore = 0;

            const pageData = await Page.findById(page);
            for (let tableItem of pageData.tables) {
                if (
                    JSON.stringify(tableItem._id) ===
                    JSON.stringify(new mongoose.Types.ObjectId(table))
                ) {
                    if (tableItem.fixedScore) {
                        totalScore = tableItem.fixedScore;
                        break;
                    } else {
                        tableItem.rowTitleList.forEach((rowTitleItem) => {
                            Object.keys(contentObj).forEach((key) => {
                                if (
                                    rowTitleItem.fixedValue.length > 0 &&
                                    key === rowTitleItem.titleValue
                                ) {
                                    contentObj[key] = {
                                        value: contentObj[key],
                                        score: rowTitleItem.fixedValue.find((fixedValueItem) => {
                                            if (fixedValueItem.value === contentObj[key]) {
                                                totalScore += fixedValueItem.score;
                                                return true;
                                            }
                                        }).score
                                    };
                                }
                            });
                        });
                        break;
                    }
                }
            }

            if (!pageData) throw createError.NotFound('Trang Không Tồn Tại');

            if (!rowList) {
                rowList = new Row({
                    user,
                    table,
                    page
                });

                rowList.content.push({ rowValue: contentObj });
                rowList.content[0].totalScore = totalScore;
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

                rowList.content.push({ rowValue: contentObj });
                rowItemId = rowList?.content[rowList.content.length - 1]._id;
                rowList.content[rowList.content.length - 1].totalScore = totalScore;
                await rowList.save();
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
                            fileUrl: uploadedFile.Location,
                            fileType: uploadedFile.Key.split('.').slice(-1)[0],
                            originalName: uploadedFile.Key.split('/').slice(-1)[0]
                        }))
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };

    static getDynamicRows = async ({
        page,
        limit,
        userFilterConditions,
        currentRows,
        rowsType
    }) => {
        let rowStatus = null;
        let skip = (page - 1) * limit;
        const removedDynamicRows = skip - currentRows;
        if (removedDynamicRows > 0) skip = skip - removedDynamicRows;

        switch (rowsType) {
            case 'pendingRows':
                rowStatus = 'Chờ Duyệt';
                break;
            case 'acceptedRows':
                rowStatus = 'Đã Duyệt';
                break;
            case 'rejectedRows':
                rowStatus = 'Từ Chối';
                break;
            default:
                throw createError.BadRequest();
        }

        try {
            const dynamicRows = await Row.aggregate([
                {
                    $unwind: '$content'
                },
                {
                    $match: {
                        'content.status': rowStatus
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
                    $match: userFilterConditions
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
                msg: `Lấy dữ liệu chỉ tiêu ${rowStatus.toLowerCase()} thành công`,
                data: dynamicRows
            };
        } catch (error) {
            throw error;
        }
    };

    static updateRowStatus = async ({ noteValue, rowListId, contentIdList, status, deadline }) => {
        try {
            const setDocument = {
                'content.$[element].status': status,
                'content.$[element].deadline': deadline
            };

            if (!deadline) delete setDocument['content.$[element].deadline'];

            const updatedRow = await Row.updateMany({ _id: rowListId }, setDocument, {
                multi: true,
                arrayFilters: [{ 'element._id': { $in: contentIdList } }],
                upsert: true
            });

            if (noteValue) {
                await Row.findOneAndUpdate(
                    { _id: rowListId, 'content._id': contentIdList[0] },
                    {
                        $push: {
                            'content.$.note': {
                                value: noteValue
                            }
                        }
                    }
                );
            }

            return {
                code: 200,
                msg: `Bạn đã ${
                    status === 'Phải Nộp Lại'
                        ? 'cho sinh viên nộp lại'
                        : status === 'Đã Duyệt'
                        ? 'duyệt'
                        : 'từ chối'
                } chỉ tiêu`,
                data: updatedRow
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = RowService;
