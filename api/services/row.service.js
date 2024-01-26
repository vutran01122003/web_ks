const Row = require('../models/row.model');
const mongoose = require('mongoose');
const createError = require('http-errors');
const PageService = require('./page.service');
const { getLocalDatetime } = require('../utils/getDatetime');

class RowService {
    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            const contentObj = JSON.parse(content);

            let rowList = await Row.findOne({ user, table, page });
            let rowItemId = null;

            let { pageData, totalScore } = await PageService.calculateTotalScoreOfRow({
                pageId: page,
                tableId: table,
                content: contentObj
            });

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
                await PageService.addRowIntoTableOfPage({ page, table, rowList });
            } else {
                await this.checkquantityDemanded({ page, table, user, pageData });

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

    static checkquantityDemanded = async ({ table, page, user, pageData }) => {
        try {
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
                throw createError.BadRequest('Số Lượng Đã Đạt Tối Đa');

            return quantityDemanded;
        } catch (error) {
            throw error;
        }
    };

    static resubmitRow = async ({ rowData }) => {
        try {
            const { table, page, content, contentId, rowListId } = rowData;
            const totalScore = await PageService.calculateTotalScoreOfRow({
                pageId: page,
                tableId: table,
                content
            });

            const row = await Row.findById(rowListId);
            const contentData = row.content.id(contentId);

            const updatedRow = await Row.findOneAndUpdate(
                { _id: rowListId, 'content._id': contentId },
                {
                    'content.$': {
                        _id: contentId,
                        status: 'Chờ Duyệt',
                        rowValue: content,
                        totalScore,
                        note: contentData.note,
                        createdAt: getLocalDatetime(),
                        proofFilesList: []
                    }
                },
                { new: true }
            );

            return {
                msg: 'Nộp lại thành công',
                data: updatedRow
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
                            originalName: uploadedFile.Key.split('/').slice(-1)[0],
                            Key: uploadedFile.key,
                            Bucket: uploadedFile.Bucket
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
                rowStatus = 'chờ duyệt';
                break;
            case 'acceptedRows':
                rowStatus = 'đã duyệt';
                break;
            case 'rejectedRows':
                rowStatus = 'từ chối';
                break;
            case 'resubmitedRows':
                rowStatus = 'phải nộp lại';
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
                        content: ['$content']
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

    static updateRowStatus = async ({
        noteValue,
        rowListId,
        contentIdList,
        status,
        deadline,
        isTimedExtension
    }) => {
        try {
            let content = '';
            switch (status) {
                case 'phải nộp lại':
                    content = `${
                        isTimedExtension ? 'Gia hạn thành công' : 'Cho phép nộp lại thành công'
                    } `;
                    break;
                case 'đã duyệt':
                    content = 'Duyệt thành công';
                    break;
                case 'từ chối':
                    content = 'Đã Từ chối hoạt động';
                    break;
                default:
                    content = 'Có lỗi hệ thống xảy ra';
                    break;
            }

            const row = await Row.findById(rowListId);

            if (row.content.id(contentIdList[0]).status !== 'phải nộp lại' && isTimedExtension) {
                status = row.content.id(contentIdList[0]).status;
                content = 'Hoạt động đã được nộp lại trước đó';
            }

            row.content.id(contentIdList[0]).status = status;
            if (deadline) row.content.id(contentIdList[0]).deadline = deadline;

            await row.save();

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
                msg: content
                // data: updatedRow
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
}

module.exports = RowService;
