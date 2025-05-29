const PageService = require("../services/page.service");
const DeadlineService = require("../services/deadline.service");
const FacultyService = require("../services/faculty.service");
const createHttpError = require("http-errors");

const { TEMPORARY_TALENT_ENGINEER_PAGE_TYPE, TALENT_ENGINEER_PAGE_TYPE, GOAL_PAGE } = process.env;
class PageControllers {
    createPage = async (req, res, next) => {
        try {
            const {
                pageType,
                pageFaculty,
                pageStudentCohort,
                pageStudentMajor,
                pageTalentEngineerType,
                pageStudentLevelYear
            } = req.body;

            const createdPage = await PageService.createPage(req.body);

            if (pageType === GOAL_PAGE) {
                const [facultyData, majorData, cohortData] = await Promise.all([
                    FacultyService.getFacultyByName({ facultyName: pageFaculty }),
                    FacultyService.getMajorByName({ majorName: pageStudentMajor }),
                    FacultyService.getCohortByName({ majorName: pageStudentMajor, cohortName: pageStudentCohort })
                ]);

                if (!facultyData || !majorData || !cohortData)
                    throw createHttpError.BadRequest("Dữ liệu khoa không tồn tại");

                const deadline = await DeadlineService.getDeadline({
                    facultyId: facultyData._id,
                    majorId: majorData._id,
                    cohortId: cohortData._id,
                    talentEngineerType: pageTalentEngineerType,
                    levelYear: pageStudentLevelYear
                });

                if (!deadline)
                    await DeadlineService.createDeadline({
                        facultyId: facultyData._id,
                        majorId: majorData._id,
                        cohortId: cohortData._id,
                        talentEngineerType: pageTalentEngineerType,
                        levelYear: pageStudentLevelYear
                    });
            }

            res.status(201).json({
                status: createdPage.status,
                msg: createdPage.msg,
                data: createdPage.data
            });
        } catch (error) {
            next(error);
        }
    };

    getPages = async (req, res, next) => {
        try {
            const { userId, ...fields } = req.query;
            const groupCode = res.locals.userData.groups[0].groupCode;
            const condition = [TEMPORARY_TALENT_ENGINEER_PAGE_TYPE, TALENT_ENGINEER_PAGE_TYPE].includes(groupCode);

            let pages = [];

            if (userId) {
                const { pageStudentCohort, pageStudentLevelYear } = fields;

                if (condition) fields.pageTalentEngineerType = groupCode;
                if (pageStudentLevelYear) fields.pageStudentLevelYear = parseInt(pageStudentLevelYear);

                pages = await PageService.getPages(fields, userId);
            } else pages = await PageService.getGoals(fields);

            res.status(200).json({
                status: "Lấy dữ liệu trang thành công",
                data: pages
            });
        } catch (error) {
            next(error);
        }
    };

    getActivities = async (req, res, next) => {
        try {
            const { pageStudentMajor, pageStudentCohort, pageStudentLevelYear, pageTalentEngineerType } = req.query;
            const activities = await PageService.getActivities({
                pageStudentMajor,
                pageStudentCohort,
                pageStudentLevelYear,
                pageTalentEngineerType
            });

            return res.status(200).json({
                status: "Lấy Toàn Bộ Hoạt Động Thành Công",
                data: activities || []
            });
        } catch (error) {
            next(error);
        }
    };

    getPage = async (req, res, next) => {
        const { pageName } = req.params;
        const { pageStudentMajor, pageStudentCohort, pageFaculty, pageStudentLevelYear } = req.query;
        const groupCode = res.locals.userData.groups[0].groupCode;
        const condition = [TEMPORARY_TALENT_ENGINEER_PAGE_TYPE, TALENT_ENGINEER_PAGE_TYPE].includes(groupCode);

        const fields = {
            pageName,
            pageFaculty,
            pageStudentMajor,
            pageStudentCohort: pageStudentCohort,
            pageStudentLevelYear: parseInt(pageStudentLevelYear)
        };

        if (condition) fields.pageTalentEngineerType = groupCode;

        const page = await PageService.getPage({
            fields,
            userId: res.locals.userData._id
        });

        try {
            res.status(200).json({
                status: page.status,
                data: page.data,
                msg: page.msg
            });
        } catch (error) {
            next(error);
        }
    };

    updateStatusPage = async (req, res, next) => {
        try {
            const { pageId, currentStatus } = req.body;

            const updatedPage = await PageService.updateStatusPage({ pageId, currentStatus });

            res.status(200).json({
                status: updatedPage.status,
                msg: updatedPage.msg
            });
        } catch (error) {
            next(error);
        }
    };

    removePage = async (req, res, next) => {
        try {
            const { pageId } = req.body;

            const removedPage = await PageService.removePage({ pageId });

            res.status(200).json({
                status: removedPage.status,
                msg: removedPage.msg
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new PageControllers();
