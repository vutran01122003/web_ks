const createError = require("http-errors");
const Page = require("../models/page.model");
const UserService = require("./user.service");
const convertToObjectId = require("../utils/convertToObjectId");
const FacultyService = require("./faculty.service");

const { TEMPORARY_TALENT_ENGINEER_PAGE_TYPE, TALENT_ENGINEER_PAGE_TYPE, GOAL_PAGE } = process.env;

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
                pageTalentEngineerType,
                pageStudentLevelYear,
                totalScore,
                cohortData
            } = data;
            const isTemporaryEngineer = pageTalentEngineerType === TEMPORARY_TALENT_ENGINEER_PAGE_TYPE;

            const page = await Page.findOne({
                pageName,
                pageStudentCohort,
                pageStudentMajor,
                pageTalentEngineerType,
                pageStudentLevelYear
            }).lean();

            if (page) throw createError(409, "Tên Trang Đã Tồn Tại");

            if (pageType === GOAL_PAGE) {
                if (isTemporaryEngineer) {
                    if (pageStudentLevelYear !== cohortData.currentLevelYear) {
                        throw createError.BadRequest(`Năm ${pageStudentLevelYear} không thể xét tuyển bổ sung`);
                    }

                    await FacultyService.updateAdditionalApplyCohort({
                        majorName: pageStudentMajor,
                        cohortName: pageStudentCohort,
                        levelYear: pageStudentLevelYear,
                        isActive: true
                    });
                } else {
                    if (pageStudentLevelYear === 1)
                        throw createError.BadRequest("Không thể tạo nhóm chỉ tiêu cho năm 1");

                    const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                        majorName: pageStudentMajor,
                        cohortName: pageStudentCohort
                    });

                    if (currentLevelYear > pageStudentLevelYear) {
                        throw createError.BadRequest("Không thể tạo nhóm chỉ tiêu cho năm học đã kết thúc");
                    } else if (currentLevelYear < pageStudentLevelYear) {
                        throw createError.BadRequest(`Năm học chưa kết thúc (Năm ${levelYear})`);
                    }
                }

                createdPage = await Page.create({
                    pageName,
                    pageFaculty,
                    pageStudentCohort,
                    pageStudentMajor,
                    pageTalentEngineerType,
                    pageStudentLevelYear,
                    tables,
                    pageType,
                    totalScore
                });

                await UserService.updateNumOfRequiredActivity({
                    page: createdPage,
                    tables,
                    isDesc: false
                });
            } else {
                createdPage = await Page.create({
                    pageName,
                    pageType
                });
            }

            return {
                status: 201,
                msg: `Tạo ${pageType === GOAL_PAGE ? "Trang" : "Loại Tin Tức"} Thành Công`,
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
                    $unwind: "$tables"
                },
                {
                    $match: {
                        "tables.isActive": true
                    }
                },
                {
                    $lookup: {
                        from: "rows",
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$user", convertToObjectId(userId)] }
                                }
                            }
                        ],
                        localField: "tables.rowValueList",
                        foreignField: "_id",
                        as: "tables.rowValueList"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        pageName: { $first: "$pageName" },
                        pageType: { $first: "$pageType" },
                        pageFaculty: { $first: "$pageFaculty" },
                        pageStudentMajor: { $first: "$pageStudentMajor" },
                        pageStudentCohort: { $first: "$pageStudentCohort" },
                        pageStudentLevelYear: { $first: "$pageStudentLevelYear" },
                        pageTalentEngineerType: { $first: "$pageTalentEngineerType" },
                        totalScore: { $first: "totalScore" },
                        isActive: { $first: "$isActive" },
                        tables: {
                            $push: "$tables"
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

    static getActivities = async ({
        pageStudentMajor,
        pageStudentCohort,
        pageStudentLevelYear,
        pageTalentEngineerType
    }) => {
        try {
            const pages = await Page.aggregate([
                {
                    $match: {
                        pageStudentMajor,
                        pageStudentCohort: pageStudentCohort,
                        pageStudentLevelYear: Number.parseInt(pageStudentLevelYear),
                        pageTalentEngineerType: pageTalentEngineerType,
                        isActive: true
                    }
                },
                {
                    $unwind: "$tables"
                },
                {
                    $match: {
                        "tables.isActive": true
                    }
                },
                {
                    $project: {
                        "tables.tableName": 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        tables: {
                            $push: "$tables"
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
                ...fields
            });
            return pageInfo;
        } catch (error) {
            throw error;
        }
    };

    static addRowIntoTableOfPage = async ({ page, table, rowList }) => {
        try {
            await Page.findOneAndUpdate(
                { _id: page, "tables._id": table },
                {
                    $push: {
                        "tables.$.rowValueList": rowList._id
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };

    static getPage = async ({ fields, userId }) => {
        try {
            const page = await Page.aggregate([
                {
                    $match: {
                        ...fields,
                        isActive: true
                    }
                },
                {
                    $unwind: "$tables"
                },
                {
                    $match: {
                        "tables.isActive": true
                    }
                },
                {
                    $lookup: {
                        from: "rows",
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$user", convertToObjectId(userId)] }
                                }
                            }
                        ],
                        localField: "tables.rowValueList",
                        foreignField: "_id",
                        as: "tables.rowValueList"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        pageName: { $first: "$pageName" },
                        pageType: { $first: "$pageType" },
                        pageFaculty: { $first: "$pageFaculty" },
                        pageStudentMajor: { $first: "$pageStudentMajor" },
                        pageStudentCohort: { $first: "$pageStudentCohort" },
                        pageStudentLevelYear: { $first: "$pageStudentLevelYear" },
                        pageTalentEngineerType: { $first: "$pageTalentEngineerType" },
                        isActive: { $first: "$isActive" },
                        tables: {
                            $push: "$tables"
                        }
                    }
                }
            ]);

            return {
                status: 200,
                msg: "Lấy Dữ Liệu Trang Thành Công",
                data: page[0]
            };
        } catch (error) {
            throw error;
        }
    };

    static removePage = async ({ pageId }) => {
        try {
            const page = await Page.findById(pageId);
            if (!page) throw createError.NotFound("Trang không tồn tại");

            await UserService.updateNumOfRequiredActivity({
                page: page,
                tables: page.tables,
                isDesc: true
            });

            await Page.findOneAndDelete({ _id: pageId });

            return {
                status: 200,
                msg: "Xóa Trang Thành Công"
            };
        } catch (error) {
            throw error;
        }
    };

    static updatePage = async ({ pageId, updatedData }) => {
        try {
            await Page.findByIdAndUpdate(pageId, updatedData, { new: true });

            return {
                status: 200,
                msg: "Cập nhật thành công"
            };
        } catch (error) {
            throw error;
        }
    };

    static getPageDetailsList = async ({
        pageStudentMajor,
        pageStudentLevelYear,
        pageStudentCohort,
        groupCode,
        filterArr
    }) => {
        try {
            const fields = {
                pageStudentMajor,
                pageStudentLevelYear: parseInt(pageStudentLevelYear),
                pageStudentCohort: pageStudentCohort
            };

            if ([TALENT_ENGINEER_PAGE_TYPE, TEMPORARY_TALENT_ENGINEER_PAGE_TYPE].includes(groupCode))
                fields.pageTalentEngineerType = groupCode;

            const pageDetailsList = await Page.aggregate([
                {
                    $match: fields
                },
                {
                    $unwind: "$tables"
                },
                {
                    $lookup: {
                        from: "rows",
                        let: { rowIds: "$tables.rowValueList" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: filterArr
                                    }
                                }
                            }
                        ],
                        as: "tables.rowValueList"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        pageName: { $first: "$pageName" },
                        pageType: { $first: "$pageType" },
                        pageFaculty: { $first: "$pageFaculty" },
                        pageStudentMajor: { $first: "$pageStudentMajor" },
                        pageStudentCohort: { $first: "$pageStudentCohort" },
                        pageStudentLevelYear: { $first: "$pageStudentLevelYear" },
                        tables: {
                            $push: "$tables"
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
