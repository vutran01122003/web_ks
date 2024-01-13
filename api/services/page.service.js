const createError = require('http-errors');
const Page = require('../models/page.model');
const UserService = require('./user.service');

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
                pageFaculty,
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

                let quantityDemanded = 0;
                tables.forEach((table) => {
                    quantityDemanded += table.quantityDemanded;
                });

                await UserService.updateAnnualTaskProgress({
                    pageFaculty,
                    pageStudentCohort,
                    pageStudentMajor,
                    pageStudentLevelYear,
                    quantityDemanded
                });

                return {
                    status: 201,
                    msg: `Tạo ${pageType === 'chỉ tiêu' ? 'Trang' : 'Loại Tin Tức'} Thành Công`,
                    data: createdPage
                };
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    static getAllPage = async () => {
        try {
            const pages = await Page.find();
            return pages;
        } catch (error) {
            throw error;
        }
    };

    static getPage = async ({ pageName, userId }) => {
        try {
            const page = await Page.findOne({ pageName })
                .populate({
                    path: 'tables',
                    populate: {
                        path: 'rowValueList',
                        model: 'row',
                        select: 'content proofImageList',
                        match: { user: userId }
                    }
                })
                .lean();
            return {
                status: 200,
                msg: 'Lấy Dữ Liệu Trang Thành Công',
                data: page
            };
        } catch (error) {
            throw error;
        }
    };

    static removePage = async ({ pageId }) => {
        try {
            await Page.findOneAndDelete({ _id: pageId });
            const pages = await Page.findById(pageId);

            let quantityDemanded = 0;
            pages.tables.forEach((table) => {
                quantityDemanded += table.quantityDemanded;
            });

            return {
                status: 200,
                msg: 'Xóa Trang thành công'
            };
        } catch (error) {
            throw error;
        }
    };

    static getPageDetailsList = async ({
        pageStudentMajor,
        pageStudentLevelYear,
        pageStudentCohort,
        filterArr
    }) => {
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
