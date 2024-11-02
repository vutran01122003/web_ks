const createError = require("http-errors");
const Page = require("../models/page.model");
const UserService = require("./user.service");
const convertToObjectId = require("../utils/convertToObjectId");
const FacultyService = require("./faculty.service");

const { TEMPORARY_TALENT_ENGINEER_TYPE, TALENT_ENGINEER_TYPE, GOAL_PAGE, NEWS_PAGE } = process.env;

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
                pageStudentLevelYear
            } = data;
            const isTemporaryEngineer = pageTalentEngineerType === TEMPORARY_TALENT_ENGINEER_TYPE;

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
                    const additionalRegisterInfo = await FacultyService.getAdditionalRegisterInfo({
                        facultyName: pageFaculty,
                        majorName: pageStudentMajor,
                        cohortName: pageStudentCohort
                    });

                    const levelYear = additionalRegisterInfo?.levelYear;
                    const isActive = additionalRegisterInfo?.isActive;

                    const levelYearConditions =
                        levelYear > pageStudentLevelYear || (!isActive && levelYear === pageStudentLevelYear);
                    const validConditions = levelYear !== undefined && isActive !== undefined;

                    if (validConditions && levelYearConditions) {
                        throw createError.BadRequest("Năm đăng ký bổ sung đã kết thúc");
                    } else if (validConditions && pageStudentLevelYear > levelYear && isActive) {
                        throw createError.BadRequest(`Năm đăng ký bổ sung hiện tại chưa kết thúc (Năm ${levelYear})`);
                    }

                    await FacultyService.updateAdditionalApplyCohort({
                        facultyName: pageFaculty,
                        majorName: pageStudentMajor,
                        cohortName: +pageStudentCohort,
                        levelYear: pageStudentLevelYear,
                        isActive: true
                    });
                } else {
                    const currentLevelYear = await FacultyService.getCurrentLevelYearOfCohort({
                        facultyName: pageFaculty,
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
                    pageType
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
                        pageStudentCohort: Number.parseInt(pageStudentCohort),
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

    static calculateTotalScoreOfRow = async ({ pageId, content, tableId }) => {
        try {
            let totalScore = 0;
            const pageData = await this.getPageById({ page: pageId });
            if (!pageData) throw createError.NotFound("Trang Không Tồn Tại");

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
            } else throw createError.NotFound("Chỉ tiêu không tồn tại");

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
                msg: "Cập nhật trạng thái trang thành công"
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
                pageStudentLevelYear: +pageStudentLevelYear,
                pageStudentCohort: +pageStudentCohort
            };

            if ([TALENT_ENGINEER_TYPE, TEMPORARY_TALENT_ENGINEER_TYPE].includes(groupCode))
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
