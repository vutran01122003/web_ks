const createError = require('http-errors');
const Page = require('../models/page.model');
const UserService = require('./user.service');
const convertToObjectId = require('../utils/convertToObjectId');

class PageService {
    static createPage = async (data) => {
        try {
            let createdPage = null;
            const {
                pageName,
                tables,
                pageType,
                pageFaculty,
                pageStudentCohort,
                pageStudentMajor,
                pageStudentLevelYear
            } = data;

            const isExists = await Page.findOne({
                pageName,
                pageStudentCohort,
                pageStudentMajor,
                pageStudentLevelYear
            }).lean();

            if (isExists) throw createError(409, 'Tên Trang Đã Tồn Tại');

            if (pageType === 'tin tức') {
                createdPage = await Page.create({
                    pageName,
                    pageType
                });
            } else if (pageType === 'chỉ tiêu') {
                createdPage = await Page.create({
                    pageName,
                    pageFaculty,
                    pageStudentCohort,
                    pageStudentMajor,
                    pageStudentLevelYear,
                    tables,
                    pageType
                });

                await UserService.updateNumOfRequiredActivity({
                    page: createdPage,
                    tables,
                    isDesc: false
                });
            }

            return {
                status: 201,
                msg: `Tạo ${pageType === 'chỉ tiêu' ? 'Trang' : 'Loại Tin Tức'} Thành Công`,
                data: createdPage
            };
        } catch (error) {
            throw error;
        }
    };

    static getPages = async (fields, userId) => {
        try {
            const pages = await Page.aggregate([
                {
                    $match: {
                        ...fields,
                        isActive: true
                    }
                },
                {
                    $unwind: '$tables'
                },
                {
                    $match: {
                        'tables.isActive': true
                    }
                },
                {
                    $lookup: {
                        from: 'rows',
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$user', convertToObjectId(userId)] }
                                }
                            }
                        ],
                        localField: 'tables.rowValueList',
                        foreignField: '_id',
                        as: 'tables.rowValueList'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        pageName: { $first: '$pageName' },
                        pageType: { $first: '$pageType' },
                        pageFaculty: { $first: '$pageFaculty' },
                        pageStudentMajor: { $first: '$pageStudentMajor' },
                        pageStudentCohort: { $first: '$pageStudentCohort' },
                        pageStudentLevelYear: { $first: '$pageStudentLevelYear' },
                        isActive: { $first: '$isActive' },
                        tables: {
                            $push: '$tables'
                        }
                    }
                }
            ]);

            return pages;
        } catch (error) {
            throw error;
        }
    };

    static getGoals = async (fields) => {
        try {
            const goals = await Page.find(fields);
            return goals;
        } catch (error) {
            throw error;
        }
    };

    static getActivities = async ({ pageStudentMajor, pageStudentCohort, pageStudentLevelYear }) => {
        try {
            const pages = await Page.aggregate([
                {
                    $match: {
                        pageStudentMajor,
                        pageStudentCohort: Number.parseInt(pageStudentCohort),
                        pageStudentLevelYear: Number.parseInt(pageStudentLevelYear),
                        isActive: true
                    }
                },
                {
                    $unwind: '$tables'
                },
                {
                    $match: {
                        'tables.isActive': true
                    }
                },
                {
                    $project: {
                        'tables.tableName': 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        tables: {
                            $push: '$tables'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        tables: 1
                    }
                }
            ]);
            return pages;
        } catch (error) {
            throw error;
        }
    };

    static getPageById = async ({ page }) => {
        try {
            const pageInfo = await Page.findOne({
                _id: page
            });
            return pageInfo;
        } catch (error) {
            throw error;
        }
    };

    static getPageByFields = async (fields) => {
        try {
            const pageInfo = await Page.findOne({
                ...fields,
                isActive: true
            });
            return pageInfo;
        } catch (error) {
            throw error;
        }
    };

    static calculateTotalScoreOfRow = async ({ pageId, content, tableId }) => {
        try {
            let totalScore = 0;
            const pageData = await this.getPageById({ page: pageId });
            if (!pageData) throw createError.NotFound('Trang Không Tồn Tại');

            const table = pageData.tables.id(tableId);

            if (table) {
                if (table.fixedScore) {
                    totalScore = table.fixedScore;
                } else {
                    table.rowTitleList.forEach((rowTitleItem) => {
                        const fixedValueList = rowTitleItem.fixedValue;
                        if (fixedValueList.length > 0) {
                            const fixedValueOfContent = content[rowTitleItem._id];
                            const score = fixedValueList.find(
                                (fixedValueItem) => fixedValueItem.value === fixedValueOfContent
                            ).score;
                            content[rowTitleItem._id] = {
                                value: fixedValueOfContent,
                                score
                            };
                            totalScore += score;
                        }
                    });
                }
            } else throw createError.NotFound('Chỉ tiêu không tồn tại');

            return {
                pageData,
                totalScore
            };
        } catch (error) {
            throw error;
        }
    };

    static addRowIntoTableOfPage = async ({ page, table, rowList }) => {
        try {
            await Page.findOneAndUpdate(
                { _id: page, 'tables._id': table },
                {
                    $push: {
                        'tables.$.rowValueList': rowList._id
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };

    static getPage = async ({ pageName, userId }) => {
        try {
            const page = await Page.aggregate([
                {
                    $match: {
                        pageName,
                        isActive: true
                    }
                },
                {
                    $unwind: '$tables'
                },
                {
                    $match: {
                        'tables.isActive': true
                    }
                },
                {
                    $lookup: {
                        from: 'rows',
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$user', convertToObjectId(userId)] }
                                }
                            }
                        ],
                        localField: 'tables.rowValueList',
                        foreignField: '_id',
                        as: 'tables.rowValueList'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        pageName: { $first: '$pageName' },
                        pageType: { $first: '$pageType' },
                        pageFaculty: { $first: '$pageFaculty' },
                        pageStudentMajor: { $first: '$pageStudentMajor' },
                        pageStudentCohort: { $first: '$pageStudentCohort' },
                        pageStudentLevelYear: { $first: '$pageStudentLevelYear' },
                        isActive: { $first: '$isActive' },
                        tables: {
                            $push: '$tables'
                        }
                    }
                }
            ]);

            return {
                status: 200,
                msg: 'Lấy Dữ Liệu Trang Thành Công',
                data: page[0]
            };
        } catch (error) {
            throw error;
        }
    };

    static removePage = async ({ pageId }) => {
        try {
            const page = await Page.findById(pageId);
            if (!page) throw createError.NotFound('Trang không tồn tại');

            await UserService.updateNumOfRequiredActivity({
                page: page,
                tables: page.tables,
                isDesc: true
            });

            await Page.findOneAndDelete({ _id: pageId });

            return {
                status: 200,
                msg: 'Xóa Trang Thành Công'
            };
        } catch (error) {
            throw error;
        }
    };

    static updateStatusPage = async ({ pageId, currentStatus }) => {
        try {
            await Page.findByIdAndUpdate(
                pageId,
                {
                    isActive: !currentStatus
                },
                { new: true }
            );

            return {
                status: 200,
                msg: 'Cập nhật trạng thái trang thành công'
            };
        } catch (error) {
            throw error;
        }
    };

    static getPageDetailsList = async ({ pageStudentMajor, pageStudentLevelYear, pageStudentCohort, filterArr }) => {
        try {
            const pageDetailsList = await Page.aggregate([
                {
                    $match: {
                        pageStudentMajor,
                        pageStudentLevelYear: pageStudentLevelYear * 1,
                        pageStudentCohort: pageStudentCohort * 1
                    }
                },
                {
                    $unwind: '$tables'
                },
                {
                    $lookup: {
                        from: 'rows',
                        let: { rowIds: '$tables.rowValueList' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: filterArr
                                    }
                                }
                            }
                        ],
                        as: 'tables.rowValueList'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        pageName: { $first: '$pageName' },
                        pageType: { $first: '$pageType' },
                        pageFaculty: { $first: '$pageFaculty' },
                        pageStudentMajor: { $first: '$pageStudentMajor' },
                        pageStudentCohort: { $first: '$pageStudentCohort' },
                        pageStudentLevelYear: { $first: '$pageStudentLevelYear' },
                        tables: {
                            $push: '$tables'
                        }
                    }
                },
                {
                    $sort: {
                        pageName: 1
                    }
                }
            ]);

            return pageDetailsList;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = PageService;
