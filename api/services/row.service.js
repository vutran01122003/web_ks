const Row = require('../models/row.model');
const createError = require('http-errors');
const PageService = require('./page.service');
const convertToObjectId = require('../utils/convertToObjectId');

class RowService {
    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            const contentObj = JSON.parse(content);

            let rowItemId = null;
            let [rowList, { pageData, totalScore }] = await Promise.all([
                Row.findOne({ user, table }),
                PageService.calculateTotalScoreOfRow({
                    pageId: page,
                    tableId: table,
                    content: contentObj
                })
            ]);

            if (!rowList) {
                rowList = new Row({
                    user,
                    table,
                    page
                });

                rowList.content.push({ rowValue: contentObj });
                rowList.content[0].totalScore = totalScore;
                rowItemId = rowList.content[rowList.content.length - 1]._id;

                await Promise.all([rowList.save(), PageService.addRowIntoTableOfPage({ page, table, rowList })]);
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

    static deleteRowByUserId = async ({ userId }) => {
        try {
            await Row.deleteMany({ user: userId });
        } catch (error) {
            throw error;
        }
    };

    static checkquantityDemanded = async ({ table, page, user, pageData }) => {
        try {
            const quantityDemanded = await Row.aggregate([
                {
                    $match: {
                        table: convertToObjectId(table),
                        user: convertToObjectId(user),
                        page: convertToObjectId(page)
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

            if (quantityDemanded[0] && quantityDemanded[0].count === pageData.tables.id(table).quantityDemanded)
                throw createError.BadRequest('Số Lượng Đã Đạt Tối Đa');

            return quantityDemanded;
        } catch (error) {
            throw error;
        }
    };

    static resubmitRow = async ({ rowData }) => {
        try {
            const { table, page, content, contentId, rowListId } = rowData;
            const { totalScore } = await PageService.calculateTotalScoreOfRow({
                pageId: page,
                tableId: table,
                content
            });

            const row = await Row.findById(rowListId);
            const contentData = row.content.id(contentId);

            if (contentData?.deadline && contentData.deadline.getTime() < new Date().getTime())
                throw createError.BadRequest(
                    `Đã quá hạn nộp là ${contentData?.deadline && contentData.deadline.toLocaleString('en-GB')}`
                );

            contentData.status = 'chờ duyệt';
            contentData.addProofFiles = [];
            contentData.rowValue = content;
            contentData.totalScore = totalScore;

            const updatedRow = await Row.findOneAndUpdate(
                { _id: rowListId, 'content._id': contentId },
                {
                    'content.$': contentData
                },
                { new: true }
            );

            return {
                status: 200,
                msg: 'Nộp lại thành công',
                data: updatedRow ? updatedRow : null
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
        rowsType,
        activity,
        pageStudentMajor,
        pageStudentCohort,
        pageStudentLevelYear
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
                    $unwind: {
                        path: '$content',
                        preserveNullAndEmptyArrays: true
                    }
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
                    $unwind: {
                        path: '$page',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        'page.pageStudentMajor': pageStudentMajor,
                        'page.pageStudentCohort': Number.parseInt(pageStudentCohort),
                        'page.pageStudentLevelYear': Number.parseInt(pageStudentLevelYear)
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
                    $unwind: {
                        path: '$page.tables',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        'page.tables.tableName': activity,

                        $expr: {
                            $eq: ['$table', '$page.tables._id']
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        user: 1,
                        page: 1,
                        content: ['$content']
                    }
                }
            ]);

            return {
                status: 200,
                msg: `Lấy dữ liệu chỉ tiêu ${rowStatus.toLowerCase()} thành công`,
                data: dynamicRows
            };
        } catch (error) {
            throw error;
        }
    };

    static updateRowStatus = async ({ noteValue, rowListId, contentIdList, status, deadline, isTimedExtension }) => {
        try {
            let content = '';
            switch (status) {
                case 'phải nộp lại':
                    content = `${isTimedExtension ? 'Gia hạn thành công' : 'Cho phép nộp lại thành công'} `;
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
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = RowService;
